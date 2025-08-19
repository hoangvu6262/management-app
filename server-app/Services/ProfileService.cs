using ManagementApp.Data;
using ManagementApp.DTOs.Profile;
using ManagementApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;

namespace ManagementApp.Services
{
    public interface IProfileService
    {
        Task<UserProfileDto?> GetUserProfileAsync(Guid userId);
        Task<bool> UpdateUserProfileAsync(Guid userId, UpdateProfileDto updateProfileDto);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto);
        Task<TwoFactorSetupDto> SetupTwoFactorAsync(Guid userId);
        Task<bool> VerifyAndEnableTwoFactorAsync(Guid userId, string code);
        Task<bool> DisableTwoFactorAsync(Guid userId, string password);
        Task<string[]> GenerateBackupCodesAsync(Guid userId);
        
        // Admin functions
        Task<List<AdminUserManagementDto>> GetAllUsersAsync();
        Task<bool> UpdateUserRoleAsync(Guid targetUserId, string newRole, Guid adminUserId);
        Task<bool> ToggleUserStatusAsync(Guid targetUserId, Guid adminUserId);
        Task<SystemConfigDto> GetSystemConfigAsync();
        Task<bool> UpdateSystemConfigAsync(SystemConfigDto config, Guid adminUserId);
    }

    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public ProfileService(ApplicationDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                TwoFactorEnabled = user.TwoFactorEnabled,
                EmailVerified = user.EmailVerified,
                LastLoginAt = user.LastLoginAt
            };
        }

        public async Task<bool> UpdateUserProfileAsync(Guid userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            // Check if email is already taken by another user
            if (!string.IsNullOrEmpty(updateProfileDto.Email) && updateProfileDto.Email != user.Email)
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == updateProfileDto.Email && u.Id != userId);
                if (emailExists) return false;
                
                user.Email = updateProfileDto.Email;
                user.EmailVerified = false; // Reset email verification when email changes
            }

            if (!string.IsNullOrEmpty(updateProfileDto.FullName))
            {
                user.FullName = updateProfileDto.FullName;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            // Verify current password
            if (!_passwordHasher.VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
                return false;

            // Hash new password
            user.PasswordHash = _passwordHasher.HashPassword(changePasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            // Invalidate all refresh tokens for security
            var refreshTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId)
                .ToListAsync();
            _context.RefreshTokens.RemoveRange(refreshTokens);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TwoFactorSetupDto> SetupTwoFactorAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) throw new ArgumentException("User not found");

            // Generate secret key (32 characters base32)
            var secretKey = GenerateBase32Secret();
            
            // Store secret key (not enabled yet)
            user.TwoFactorSecretKey = secretKey;
            await _context.SaveChangesAsync();

            // Generate QR code URL using external service (simple approach)
            var issuer = "ManagementApp";
            var accountTitle = $"{issuer}:{user.Email}";
            var otpUrl = $"otpauth://totp/{accountTitle}?secret={secretKey}&issuer={issuer}";
            
            // Use QR Server API for QR code generation
            var qrCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={Uri.EscapeDataString(otpUrl)}";

            // Generate backup codes
            var backupCodes = GenerateBackupCodes();
            user.BackupCodes = JsonSerializer.Serialize(backupCodes);
            await _context.SaveChangesAsync();

            return new TwoFactorSetupDto
            {
                SecretKey = secretKey,
                QrCodeUrl = qrCodeUrl,
                BackupCodes = backupCodes
            };
        }

        public async Task<bool> VerifyAndEnableTwoFactorAsync(Guid userId, string code)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null || string.IsNullOrEmpty(user.TwoFactorSecretKey)) return false;

            // For demo purposes, we'll do basic validation
            // In production, you'd want to use a proper TOTP library
            var isValidCode = ValidateTOTPCode(user.TwoFactorSecretKey, code);

            if (isValidCode)
            {
                user.TwoFactorEnabled = true;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> DisableTwoFactorAsync(Guid userId, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            // Verify password before disabling 2FA
            if (!_passwordHasher.VerifyPassword(password, user.PasswordHash))
                return false;

            user.TwoFactorEnabled = false;
            user.TwoFactorSecretKey = null;
            user.BackupCodes = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string[]> GenerateBackupCodesAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) throw new ArgumentException("User not found");

            var backupCodes = GenerateBackupCodes();
            user.BackupCodes = JsonSerializer.Serialize(backupCodes);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return backupCodes;
        }

        private string GenerateBase32Secret()
        {
            const string base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var random = new Random();
            var result = new StringBuilder(32);
            for (int i = 0; i < 32; i++)
            {
                result.Append(base32Chars[random.Next(base32Chars.Length)]);
            }
            return result.ToString();
        }

        private string[] GenerateBackupCodes()
        {
            var codes = new string[8];
            var random = new Random();
            for (int i = 0; i < codes.Length; i++)
            {
                codes[i] = random.Next(100000, 999999).ToString();
            }
            return codes;
        }

        private bool ValidateTOTPCode(string secret, string code)
        {
            // Simple validation for demo - in production use proper TOTP library
            // This is just a placeholder that accepts 6-digit codes
            return code.Length == 6 && code.All(char.IsDigit);
        }

        // Admin functions
        public async Task<List<AdminUserManagementDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new AdminUserManagementDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    FullName = u.FullName,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    LastLoginAt = u.LastLoginAt
                })
                .OrderBy(u => u.Username)
                .ToListAsync();
        }

        public async Task<bool> UpdateUserRoleAsync(Guid targetUserId, string newRole, Guid adminUserId)
        {
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);
            if (targetUser == null) return false;

            // Don't allow admin to change their own role
            if (targetUserId == adminUserId) return false;

            var validRoles = new[] { "User", "Admin", "Moderator" };
            if (!validRoles.Contains(newRole)) return false;

            targetUser.Role = newRole;
            targetUser.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(Guid targetUserId, Guid adminUserId)
        {
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);
            if (targetUser == null) return false;

            // Don't allow admin to disable their own account
            if (targetUserId == adminUserId) return false;

            targetUser.IsActive = !targetUser.IsActive;
            targetUser.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SystemConfigDto> GetSystemConfigAsync()
        {
            var config = await _context.SystemConfigurations.FirstOrDefaultAsync();
            if (config == null)
            {
                // Create default config if not exists
                config = new SystemConfiguration();
                _context.SystemConfigurations.Add(config);
                await _context.SaveChangesAsync();
            }

            return new SystemConfigDto
            {
                RequireEmailVerification = config.RequireEmailVerification,
                EnableTwoFactor = config.EnableTwoFactor,
                MaxLoginAttempts = config.MaxLoginAttempts,
                SessionTimeoutMinutes = config.SessionTimeoutMinutes,
                MaintenanceMode = config.MaintenanceMode,
                SystemMessage = config.SystemMessage
            };
        }

        public async Task<bool> UpdateSystemConfigAsync(SystemConfigDto configDto, Guid adminUserId)
        {
            var config = await _context.SystemConfigurations.FirstOrDefaultAsync();
            if (config == null)
            {
                config = new SystemConfiguration();
                _context.SystemConfigurations.Add(config);
            }

            config.RequireEmailVerification = configDto.RequireEmailVerification;
            config.EnableTwoFactor = configDto.EnableTwoFactor;
            config.MaxLoginAttempts = configDto.MaxLoginAttempts;
            config.SessionTimeoutMinutes = configDto.SessionTimeoutMinutes;
            config.MaintenanceMode = configDto.MaintenanceMode;
            config.SystemMessage = configDto.SystemMessage;
            config.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
