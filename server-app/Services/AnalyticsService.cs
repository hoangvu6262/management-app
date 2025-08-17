using Microsoft.EntityFrameworkCore;
using ManagementApp.Data;
using ManagementApp.DTOs.Analytics;
using System.Globalization;

namespace ManagementApp.Services
{
    public interface IAnalyticsService
    {
        Task<AnalyticsDashboardDto> GetDashboardAnalyticsAsync(AnalyticsFilterDto filter);
        Task<FinancialStatsDto> GetFinancialStatsAsync(AnalyticsFilterDto filter);
        Task<MatchStatsDto> GetMatchStatsAsync(AnalyticsFilterDto filter);
        Task<PersonnelStatsDto> GetPersonnelStatsAsync(AnalyticsFilterDto filter);
        Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(AnalyticsFilterDto filter);
        Task<List<TopStadiumDto>> GetTopStadiumsAsync(AnalyticsFilterDto filter, int limit = 10);
        Task<List<TopTeamDto>> GetTopTeamsAsync(AnalyticsFilterDto filter, int limit = 10);
        Task<List<StatusDistributionDto>> GetStatusDistributionAsync(AnalyticsFilterDto filter);
        Task<List<MonthlyFinancialTrendDto>> GetRevenueProfitTrendAsync(AnalyticsFilterDto filter);
        Task<List<MatchTypeDistributionDto>> GetMatchTypeDistributionAsync(AnalyticsFilterDto filter);
        Task<CancelledAnalysisDto> GetCancelledAnalysisAsync(AnalyticsFilterDto filter);
        Task<PhotoCameraAnalysisDto> GetPhotographerCameramanAnalysisAsync(AnalyticsFilterDto filter);
    }

    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AnalyticsDashboardDto> GetDashboardAnalyticsAsync(AnalyticsFilterDto filter)
        {
            // Execute all tasks in parallel
            var financialStatsTask = GetFinancialStatsAsync(filter);
            var matchStatsTask = GetMatchStatsAsync(filter);
            var personnelStatsTask = GetPersonnelStatsAsync(filter);
            var monthlyTrendsTask = GetMonthlyTrendsAsync(filter);
            var topStadiumsTask = GetTopStadiumsAsync(filter, 5);
            var topTeamsTask = GetTopTeamsAsync(filter, 5);

            await Task.WhenAll(
                financialStatsTask,
                matchStatsTask,
                personnelStatsTask,
                monthlyTrendsTask,
                topStadiumsTask,
                topTeamsTask
            );

            var period = GetPeriodDescription(filter);

            return new AnalyticsDashboardDto
            {
                FinancialStats = await financialStatsTask,
                MatchStats = await matchStatsTask,
                PersonnelStats = await personnelStatsTask,
                MonthlyTrends = await monthlyTrendsTask,
                TopStadiums = await topStadiumsTask,
                TopTeams = await topTeamsTask,
                Period = period,
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<FinancialStatsDto> GetFinancialStatsAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);

            // For SQLite, we need to load data into memory first and then aggregate
            var matches = await query.ToListAsync();

            if (!matches.Any())
            {
                return new FinancialStatsDto();
            }

            var totalRevenue = matches.Sum(m => m.TotalRevenue);
            var totalCost = matches.Sum(m => m.TotalCost + m.RecordingMoneyForPhotographer + m.MoneyForCameraman);
            var totalDiscount = matches.Sum(m => m.Discount);
            var matchCount = matches.Count;

            var totalProfit = totalRevenue - totalCost - totalDiscount;
            var profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
            var discountPercentage = totalRevenue > 0 ? (totalDiscount / totalRevenue) * 100 : 0;

            return new FinancialStatsDto
            {
                TotalRevenue = totalRevenue,
                TotalCost = totalCost,
                TotalProfit = totalProfit,
                ProfitMargin = profitMargin,
                AverageRevenuePerMatch = matchCount > 0 ? totalRevenue / matchCount : 0,
                AverageProfitPerMatch = matchCount > 0 ? totalProfit / matchCount : 0,
                TotalDiscount = totalDiscount,
                DiscountPercentage = discountPercentage
            };
        }

        public async Task<MatchStatsDto> GetMatchStatsAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);

            var stats = await query
                .GroupBy(m => 1)
                .Select(g => new
                {
                    TotalMatches = g.Count(),
                    CompletedMatches = g.Count(m => m.Status == "COMPLETED"),
                    PendingMatches = g.Count(m => m.Status == "PENDING"),
                    CancelledMatches = g.Count(m => m.Status == "CANCELLED")
                })
                .FirstOrDefaultAsync();

            if (stats == null)
            {
                return new MatchStatsDto();
            }

            return new MatchStatsDto
            {
                TotalMatches = stats.TotalMatches,
                CompletedMatches = stats.CompletedMatches,
                PendingMatches = stats.PendingMatches,
                CancelledMatches = stats.CancelledMatches,
                CompletedPercentage = stats.TotalMatches > 0 ? (decimal)stats.CompletedMatches / stats.TotalMatches * 100 : 0,
                PendingPercentage = stats.TotalMatches > 0 ? (decimal)stats.PendingMatches / stats.TotalMatches * 100 : 0,
                CancelledPercentage = stats.TotalMatches > 0 ? (decimal)stats.CancelledMatches / stats.TotalMatches * 100 : 0
            };
        }

        public async Task<PersonnelStatsDto> GetPersonnelStatsAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            if (!matches.Any())
            {
                return new PersonnelStatsDto();
            }

            var totalPhotographerCost = matches.Sum(m => m.RecordingMoneyForPhotographer);
            var totalCameramanCost = matches.Sum(m => m.MoneyForCameraman);
            var matchesWithPhotographer = matches.Count(m => m.RecordingMoneyForPhotographer > 0);
            var matchesWithCameraman = matches.Count(m => m.MoneyForCameraman > 0);
            var totalMatches = matches.Count;

            return new PersonnelStatsDto
            {
                TotalPhotographerCost = totalPhotographerCost,
                TotalCameramanCost = totalCameramanCost,
                AveragePhotographerCostPerMatch = totalMatches > 0 ? totalPhotographerCost / totalMatches : 0,
                AverageCameramanCostPerMatch = totalMatches > 0 ? totalCameramanCost / totalMatches : 0,
                MatchesWithPhotographer = matchesWithPhotographer,
                MatchesWithCameraman = matchesWithCameraman,
                PhotographerParticipationRate = totalMatches > 0 ? (decimal)matchesWithPhotographer / totalMatches * 100 : 0,
                CameramanParticipationRate = totalMatches > 0 ? (decimal)matchesWithCameraman / totalMatches * 100 : 0
            };
        }

        public async Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            var monthlyData = matches
                .GroupBy(m => new { Year = m.Date.Year, Month = m.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(m => m.TotalRevenue),
                    Cost = g.Sum(m => m.TotalCost + m.RecordingMoneyForPhotographer + m.MoneyForCameraman + m.Discount),
                    MatchCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();

            return monthlyData.Select(data => new MonthlyTrendDto
            {
                Month = $"{data.Year:0000}-{data.Month:00}",
                MonthName = new DateTime(data.Year, data.Month, 1).ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                Revenue = data.Revenue,
                Cost = data.Cost,
                Profit = data.Revenue - data.Cost,
                MatchCount = data.MatchCount
            }).ToList();
        }

        public async Task<List<TopStadiumDto>> GetTopStadiumsAsync(AnalyticsFilterDto filter, int limit = 10)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            return matches
                .GroupBy(m => m.Stadium)
                .Select(g => new TopStadiumDto
                {
                    Stadium = g.Key,
                    MatchCount = g.Count(),
                    TotalRevenue = g.Sum(m => m.TotalRevenue),
                    TotalProfit = g.Sum(m => m.TotalRevenue - m.TotalCost - m.RecordingMoneyForPhotographer - m.MoneyForCameraman - m.Discount),
                    AverageRevenue = g.Average(m => m.TotalRevenue)
                })
                .OrderByDescending(x => x.TotalRevenue)
                .Take(limit)
                .ToList();
        }

        public async Task<List<TopTeamDto>> GetTopTeamsAsync(AnalyticsFilterDto filter, int limit = 10)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            return matches
                .GroupBy(m => m.Team)
                .Select(g => new TopTeamDto
                {
                    Team = g.Key,
                    MatchCount = g.Count(),
                    TotalRevenue = g.Sum(m => m.TotalRevenue),
                    TotalProfit = g.Sum(m => m.TotalRevenue - m.TotalCost - m.RecordingMoneyForPhotographer - m.MoneyForCameraman - m.Discount),
                    AverageRevenue = g.Average(m => m.TotalRevenue)
                })
                .OrderByDescending(x => x.TotalRevenue)
                .Take(limit)
                .ToList();
        }

        private IQueryable<Models.FootballMatch> GetFilteredQuery(AnalyticsFilterDto filter)
        {
            var query = _context.FootballMatches
                .Where(m => !m.DeleteStatus);

            if (filter.FromDate.HasValue)
            {
                query = query.Where(m => m.Date >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(m => m.Date <= filter.ToDate.Value);
            }

            if (!string.IsNullOrEmpty(filter.Stadium))
            {
                var stadium = filter.Stadium.Trim().ToLower();
                query = query.Where(m => m.Stadium.ToLower().Contains(stadium));
            }

            if (!string.IsNullOrEmpty(filter.Team))
            {
                var team = filter.Team.Trim().ToLower();
                query = query.Where(m => m.Team.ToLower().Contains(team));
            }

            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(m => m.Status == filter.Status);
            }

            if (!string.IsNullOrEmpty(filter.Type))
            {
                query = query.Where(m => m.Type == filter.Type);
            }

            return query;
        }

        public async Task<List<StatusDistributionDto>> GetStatusDistributionAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);

            var statusData = await query
                .GroupBy(m => m.Status)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var totalCount = statusData.Sum(x => x.Count);
            
            return statusData.Select(data => new StatusDistributionDto
            {
                Status = data.Status,
                Count = data.Count,
                Percentage = totalCount > 0 ? (decimal)data.Count / totalCount * 100 : 0,
                Color = GetStatusColor(data.Status)
            }).ToList();
        }

        public async Task<List<MonthlyFinancialTrendDto>> GetRevenueProfitTrendAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            var monthlyData = matches
                .GroupBy(m => new { Year = m.Date.Year, Month = m.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(m => m.TotalRevenue),
                    Cost = g.Sum(m => m.TotalCost + m.RecordingMoneyForPhotographer + m.MoneyForCameraman + m.Discount),
                    MatchCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();

            return monthlyData.Select(data => new MonthlyFinancialTrendDto
            {
                Month = $"{data.Year:0000}-{data.Month:00}",
                MonthName = new DateTime(data.Year, data.Month, 1).ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                Revenue = data.Revenue,
                Profit = data.Revenue - data.Cost,
                MatchCount = data.MatchCount
            }).ToList();
        }

        public async Task<List<MatchTypeDistributionDto>> GetMatchTypeDistributionAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            var typeData = matches
                .GroupBy(m => m.Type)
                .Select(g => new
                {
                    Type = g.Key,
                    Count = g.Count(),
                    Revenue = g.Sum(m => m.TotalRevenue)
                })
                .ToList();

            var totalCount = typeData.Sum(x => x.Count);
            
            return typeData.Select(data => new MatchTypeDistributionDto
            {
                Type = data.Type,
                Count = data.Count,
                Revenue = data.Revenue,
                Percentage = totalCount > 0 ? (decimal)data.Count / totalCount * 100 : 0,
                Color = GetMatchTypeColor(data.Type)
            }).ToList();
        }

        public async Task<CancelledAnalysisDto> GetCancelledAnalysisAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var allMatches = await query.ToListAsync();

            var totalMatches = allMatches.Count;
            var cancelledMatches = allMatches.Where(m => m.Status == "CANCELLED").ToList();
            var cancelledCount = cancelledMatches.Count;
            var lostRevenue = cancelledMatches.Sum(m => m.TotalRevenue);

            // Monthly cancellation data
            var monthlyData = allMatches
                .GroupBy(m => new { Year = m.Date.Year, Month = m.Date.Month })
                .Select(g => new CancelledByMonthDto
                {
                    Month = $"{g.Key.Year:0000}-{g.Key.Month:00}",
                    CancelledCount = g.Count(m => m.Status == "CANCELLED"),
                    TotalCount = g.Count(),
                    Rate = g.Count() > 0 ? (decimal)g.Count(m => m.Status == "CANCELLED") / g.Count() * 100 : 0
                })
                .OrderBy(x => x.Month)
                .ToList();

            // Reason analysis (from Notes)
            var reasonAnalysis = cancelledMatches
                .Where(m => !string.IsNullOrEmpty(m.Note))
                .GroupBy(m => ExtractCancellationReason(m.Note))
                .Select(g => new CancelledByReasonDto
                {
                    Reason = g.Key,
                    Count = g.Count(),
                    Percentage = cancelledCount > 0 ? (decimal)g.Count() / cancelledCount * 100 : 0
                })
                .ToList();

            return new CancelledAnalysisDto
            {
                TotalMatches = totalMatches,
                CancelledCount = cancelledCount,
                CancellationRate = totalMatches > 0 ? (decimal)cancelledCount / totalMatches * 100 : 0,
                LostRevenue = lostRevenue,
                MonthlyData = monthlyData,
                ReasonAnalysis = reasonAnalysis
            };
        }

        public async Task<PhotoCameraAnalysisDto> GetPhotographerCameramanAnalysisAsync(AnalyticsFilterDto filter)
        {
            var query = GetFilteredQuery(filter);
            var matches = await query.ToListAsync();

            var totalMatches = matches.Count;
            var matchesWithPhotographer = matches.Count(m => m.RecordingMoneyForPhotographer > 0);
            var matchesWithCameraman = matches.Count(m => m.MoneyForCameraman > 0);
            var matchesWithBoth = matches.Count(m => m.RecordingMoneyForPhotographer > 0 && m.MoneyForCameraman > 0);

            var monthlyCosts = matches
                .GroupBy(m => new { Year = m.Date.Year, Month = m.Date.Month })
                .Select(g => new MonthlyPersonnelCostDto
                {
                    Month = $"{g.Key.Year:0000}-{g.Key.Month:00}",
                    PhotographerCost = g.Sum(m => m.RecordingMoneyForPhotographer),
                    CameramanCost = g.Sum(m => m.MoneyForCameraman),
                    MatchCount = g.Count()
                })
                .OrderBy(x => x.Month)
                .ToList();

            return new PhotoCameraAnalysisDto
            {
                TotalPhotographerCost = matches.Sum(m => m.RecordingMoneyForPhotographer),
                TotalCameramanCost = matches.Sum(m => m.MoneyForCameraman),
                TotalMatches = totalMatches,
                MatchesWithPhotographer = matchesWithPhotographer,
                MatchesWithCameraman = matchesWithCameraman,
                MatchesWithBoth = matchesWithBoth,
                PhotographerRate = totalMatches > 0 ? (decimal)matchesWithPhotographer / totalMatches * 100 : 0,
                CameramanRate = totalMatches > 0 ? (decimal)matchesWithCameraman / totalMatches * 100 : 0,
                BothRate = totalMatches > 0 ? (decimal)matchesWithBoth / totalMatches * 100 : 0,
                MonthlyCosts = monthlyCosts
            };
        }

        private string GetStatusColor(string status)
        {
            return status.ToUpper() switch
            {
                "COMPLETED" => "#10B981", // Green
                "PENDING" => "#F59E0B",   // Yellow
                "CANCELLED" => "#EF4444", // Red
                _ => "#6B7280"            // Gray
            };
        }

        private string GetMatchTypeColor(string type)
        {
            return type switch
            {
                "S5" => "#3B82F6",  // Blue
                "S7" => "#10B981",  // Green
                "S11" => "#8B5CF6", // Purple
                _ => "#6B7280"      // Gray
            };
        }

        private string ExtractCancellationReason(string note)
        {
            // Simple logic to extract reason from note
            // You can enhance this based on your note patterns
            if (string.IsNullOrEmpty(note)) return "Unknown";
            
            note = note.ToLower();
            if (note.Contains("weather") || note.Contains("rain") || note.Contains("storm"))
                return "Weather";
            if (note.Contains("team") || note.Contains("player"))
                return "Team Issues";
            if (note.Contains("schedule") || note.Contains("conflict"))
                return "Schedule Conflict";
            if (note.Contains("stadium") || note.Contains("venue"))
                return "Venue Issues";
            if (note.Contains("covid") || note.Contains("health"))
                return "Health Concerns";
            
            return "Other";
        }

        private string GetPeriodDescription(AnalyticsFilterDto filter)
        {
            if (filter.FromDate.HasValue && filter.ToDate.HasValue)
            {
                return $"{filter.FromDate.Value:dd/MM/yyyy} - {filter.ToDate.Value:dd/MM/yyyy}";
            }
            else if (filter.FromDate.HasValue)
            {
                return $"From {filter.FromDate.Value:dd/MM/yyyy}";
            }
            else if (filter.ToDate.HasValue)
            {
                return $"Until {filter.ToDate.Value:dd/MM/yyyy}";
            }
            
            return "All Time";
        }
    }
}
