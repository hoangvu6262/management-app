using System.ComponentModel.DataAnnotations;

namespace ManagementApp.DTOs.FootballMatch
{
    public class CreateFootballMatchDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(10)]
        [RegularExpression(@"^([01]?[0-9]|2[0-3]):[0-5][0-9]$", ErrorMessage = "Time must be in HH:mm format (24-hour)")]
        public string Time { get; set; } = string.Empty; // HH:mm format

        [Required]
        [StringLength(200)]
        public string Stadium { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Team { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int MatchNumber { get; set; }

        [Required]
        [RegularExpression(@"^(S5|S7|S11)$", ErrorMessage = "Type must be S5, S7, or S11")]
        public string Type { get; set; } = "S7";

        [Range(0, double.MaxValue)]
        public decimal TotalRevenue { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal TotalCost { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal RecordingMoneyForPhotographer { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal MoneyForCameraman { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; } = 0;

        [StringLength(50)]
        [RegularExpression(@"^(PENDING|COMPLETED|CANCELLED)$", ErrorMessage = "Status must be PENDING, COMPLETED, or CANCELLED")]
        public string Status { get; set; } = "PENDING";

        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }

    public class UpdateFootballMatchDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(10)]
        [RegularExpression(@"^([01]?[0-9]|2[0-3]):[0-5][0-9]$", ErrorMessage = "Time must be in HH:mm format (24-hour)")]
        public string Time { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Stadium { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Team { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int MatchNumber { get; set; }

        [Required]
        [RegularExpression(@"^(S5|S7|S11)$", ErrorMessage = "Type must be S5, S7, or S11")]
        public string Type { get; set; } = "S7";

        [Range(0, double.MaxValue)]
        public decimal TotalRevenue { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal TotalCost { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal RecordingMoneyForPhotographer { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal MoneyForCameraman { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; } = 0;

        [StringLength(50)]
        [RegularExpression(@"^(PENDING|COMPLETED|CANCELLED)$", ErrorMessage = "Status must be PENDING, COMPLETED, or CANCELLED")]
        public string Status { get; set; } = "PENDING";

        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }

    public class UpdateStatusDto
    {
        [Required]
        [RegularExpression(@"^(PENDING|COMPLETED|CANCELLED)$", ErrorMessage = "Status must be PENDING, COMPLETED, or CANCELLED")]
        public string Status { get; set; } = string.Empty;
    }

    public class FootballMatchResponseDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Stadium { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public int MatchNumber { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal RecordingMoneyForPhotographer { get; set; }
        public decimal MoneyForCameraman { get; set; }
        public decimal Discount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public class FootballMatchFilterDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Stadium { get; set; }
        public string? Team { get; set; }
        public string? SearchText { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "Date";
        public string SortOrder { get; set; } = "desc"; // desc for newest first
    }

    public class PagedFootballMatchesDto
    {
        public List<FootballMatchResponseDto> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }
}
