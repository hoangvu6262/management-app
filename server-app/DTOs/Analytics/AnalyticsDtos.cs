using System.ComponentModel.DataAnnotations;

namespace ManagementApp.DTOs.Analytics
{
    public class AnalyticsFilterDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Stadium { get; set; }
        public string? Team { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }
    }

    public class FinancialStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal ProfitMargin { get; set; } // Percentage
        public decimal AverageRevenuePerMatch { get; set; }
        public decimal AverageProfitPerMatch { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal DiscountPercentage { get; set; }
    }

    public class MatchStatsDto
    {
        public int TotalMatches { get; set; }
        public int CompletedMatches { get; set; }
        public int PendingMatches { get; set; }
        public int CancelledMatches { get; set; }
        public decimal CompletedPercentage { get; set; }
        public decimal PendingPercentage { get; set; }
        public decimal CancelledPercentage { get; set; }
    }

    public class PersonnelStatsDto
    {
        public decimal TotalPhotographerCost { get; set; }
        public decimal TotalCameramanCost { get; set; }
        public decimal AveragePhotographerCostPerMatch { get; set; }
        public decimal AverageCameramanCostPerMatch { get; set; }
        public int MatchesWithPhotographer { get; set; }
        public int MatchesWithCameraman { get; set; }
        public decimal PhotographerParticipationRate { get; set; }
        public decimal CameramanParticipationRate { get; set; }
    }

    public class MonthlyTrendDto
    {
        public string Month { get; set; } = string.Empty; // YYYY-MM format
        public string MonthName { get; set; } = string.Empty; // January 2025
        public decimal Revenue { get; set; }
        public decimal Cost { get; set; }
        public decimal Profit { get; set; }
        public int MatchCount { get; set; }
    }

    public class TopStadiumDto
    {
        public string Stadium { get; set; } = string.Empty;
        public int MatchCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal AverageRevenue { get; set; }
    }

    public class TopTeamDto
    {
        public string Team { get; set; } = string.Empty;
        public int MatchCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal AverageRevenue { get; set; }
    }

    public class AnalyticsDashboardDto
    {
        public FinancialStatsDto FinancialStats { get; set; } = new();
        public MatchStatsDto MatchStats { get; set; } = new();
        public PersonnelStatsDto PersonnelStats { get; set; } = new();
        public List<MonthlyTrendDto> MonthlyTrends { get; set; } = new();
        public List<TopStadiumDto> TopStadiums { get; set; } = new();
        public List<TopTeamDto> TopTeams { get; set; } = new();
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string Period { get; set; } = string.Empty;
    }

    public class StatusDistributionDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class MonthlyFinancialTrendDto
    {
        public string Month { get; set; } = string.Empty; // YYYY-MM format
        public string MonthName { get; set; } = string.Empty; // January 2025
        public decimal Revenue { get; set; }
        public decimal Profit { get; set; }
        public int MatchCount { get; set; }
    }

    public class MatchTypeDistributionDto
    {
        public string Type { get; set; } = string.Empty; // S5, S7, S11
        public int Count { get; set; }
        public decimal Revenue { get; set; }
        public decimal Percentage { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class CancelledAnalysisDto
    {
        public int TotalMatches { get; set; }
        public int CancelledCount { get; set; }
        public decimal CancellationRate { get; set; }
        public decimal LostRevenue { get; set; }
        public List<CancelledByMonthDto> MonthlyData { get; set; } = new();
        public List<CancelledByReasonDto> ReasonAnalysis { get; set; } = new();
    }

    public class CancelledByMonthDto
    {
        public string Month { get; set; } = string.Empty;
        public int CancelledCount { get; set; }
        public int TotalCount { get; set; }
        public decimal Rate { get; set; }
    }

    public class CancelledByReasonDto
    {
        public string Reason { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class PhotoCameraAnalysisDto
    {
        public decimal TotalPhotographerCost { get; set; }
        public decimal TotalCameramanCost { get; set; }
        public int TotalMatches { get; set; }
        public int MatchesWithPhotographer { get; set; }
        public int MatchesWithCameraman { get; set; }
        public int MatchesWithBoth { get; set; }
        public decimal PhotographerRate { get; set; }
        public decimal CameramanRate { get; set; }
        public decimal BothRate { get; set; }
        public List<MonthlyPersonnelCostDto> MonthlyCosts { get; set; } = new();
    }

    public class MonthlyPersonnelCostDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal PhotographerCost { get; set; }
        public decimal CameramanCost { get; set; }
        public int MatchCount { get; set; }
    }
}
