using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManagementApp.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "User";

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<FootballMatch> CreatedFootballMatches { get; set; } = new List<FootballMatch>();
        public virtual ICollection<FootballMatch> UpdatedFootballMatches { get; set; } = new List<FootballMatch>();
        public virtual ICollection<CalendarEvent> CreatedCalendarEvents { get; set; } = new List<CalendarEvent>();
        public virtual ICollection<CalendarEvent> UpdatedCalendarEvents { get; set; } = new List<CalendarEvent>();
    }
}
