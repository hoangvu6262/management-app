using System.ComponentModel.DataAnnotations;

namespace ManagementApp.DTOs.Profile
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool EmailVerified { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }

    public class UpdateProfileDto
    {
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }

    public class TwoFactorSetupDto
    {
        public string SecretKey { get; set; } = string.Empty;
        public string QrCodeUrl { get; set; } = string.Empty;
        public string[] BackupCodes { get; set; } = Array.Empty<string>();
    }

    public class VerifyTwoFactorDto
    {
        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string Code { get; set; } = string.Empty;
    }

    public class AdminUserManagementDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }

    public class UpdateUserRoleDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class SystemConfigDto
    {
        public bool RequireEmailVerification { get; set; }
        public bool EnableTwoFactor { get; set; }
        public int MaxLoginAttempts { get; set; }
        public int SessionTimeoutMinutes { get; set; }
        public bool MaintenanceMode { get; set; }
        public string SystemMessage { get; set; } = string.Empty;
    }
}
