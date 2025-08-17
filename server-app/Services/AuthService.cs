using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using ManagementApp.Data;
using ManagementApp.Models;
using ManagementApp.DTOs.Auth;
using ManagementApp.Constants;

namespace ManagementApp.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
        Task<UserInfoDto?> RegisterAsync(RegisterRequestDto request);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request);
        Task<LoginResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
        Task<bool> RevokeRefreshTokenAsync(string refreshToken);
        Task<bool> RevokeAllRefreshTokensAsync(Guid userId);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IJwtService jwtService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Save refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7) // 7 days
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            var expirationMinutes = int.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"] ?? "60");

            return new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Role = user.Role,
                User = new UserInfoDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                }
            };
        }

        public async Task<UserInfoDto?> RegisterAsync(RegisterRequestDto request)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.Username == request.Username))
            {
                return null;
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Role = UserRoles.User,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserInfoDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsActive)
            {
                return false;
            }

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LoginResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var refreshToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (refreshToken == null ||
                refreshToken.IsUsed ||
                refreshToken.IsRevoked ||
                refreshToken.ExpiryDate <= DateTime.UtcNow ||
                !refreshToken.User.IsActive)
            {
                return null;
            }

            // Mark current refresh token as used
            refreshToken.IsUsed = true;

            // Generate new tokens
            var newAccessToken = _jwtService.GenerateAccessToken(refreshToken.User);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            // Save new refresh token
            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = refreshToken.UserId,
                ExpiryDate = DateTime.UtcNow.AddDays(7)
            };

            _context.RefreshTokens.Add(newRefreshTokenEntity);
            await _context.SaveChangesAsync();

            var expirationMinutes = int.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"] ?? "5");

            return new LoginResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Role = refreshToken.User.Role,
                User = new UserInfoDto
                {
                    Id = refreshToken.User.Id,
                    Username = refreshToken.User.Username,
                    Email = refreshToken.User.Email,
                    FullName = refreshToken.User.FullName,
                    Role = refreshToken.User.Role,
                    CreatedAt = refreshToken.User.CreatedAt
                }
            };
        }

        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (token == null)
            {
                return false;
            }

            token.IsRevoked = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RevokeAllRefreshTokensAsync(Guid userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked && !rt.IsUsed)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
