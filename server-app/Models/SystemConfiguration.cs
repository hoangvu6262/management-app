using System.ComponentModel.DataAnnotations;

namespace ManagementApp.Models
{
    public class SystemConfiguration
    {
        [Key]
        public int Id { get; set; } = 1; // Singleton pattern - chỉ có 1 record

        public bool RequireEmailVerification { get; set; } = false;
        public bool EnableTwoFactor { get; set; } = true;
        public int MaxLoginAttempts { get; set; } = 5;
        public int SessionTimeoutMinutes { get; set; } = 60;
        public bool MaintenanceMode { get; set; } = false;
        
        [StringLength(500)]
        public string SystemMessage { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
