using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManagementApp.Models
{
    public class FootballMatch
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(10)]
        public string Time { get; set; } = string.Empty; // Format: HH:mm (24-hour format)

        [Required]
        [StringLength(200)]
        public string Stadium { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Team { get; set; } = string.Empty;

        [Required]
        public int MatchNumber { get; set; }

        [Required]
        [StringLength(10)]
        public string Type { get; set; } = "S7"; // S5, S7, S11

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalRevenue { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalCost { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal RecordingMoneyForPhotographer { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal MoneyForCameraman { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Discount { get; set; } = 0;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "PENDING";

        [StringLength(500)]
        public string Note { get; set; } = string.Empty;

        public bool DeleteStatus { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public Guid? CreatedById { get; set; }
        public Guid? UpdatedById { get; set; }

        // Navigation properties
        [ForeignKey("CreatedById")]
        public virtual User? CreatedBy { get; set; }

        [ForeignKey("UpdatedById")]
        public virtual User? UpdatedBy { get; set; }
    }
}
