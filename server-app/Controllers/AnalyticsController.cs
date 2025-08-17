using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ManagementApp.DTOs;
using ManagementApp.DTOs.Analytics;
using ManagementApp.Services;
using ManagementApp.Utils;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        /// <summary>
        /// Get complete dashboard analytics
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<ActionResult<ApiResponse<AnalyticsDashboardDto>>> GetDashboardAnalytics(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetDashboardAnalyticsAsync(filter);
                return Ok(ApiResponse<AnalyticsDashboardDto>.SuccessResult(result, "Dashboard analytics retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<AnalyticsDashboardDto>.ErrorResult($"An error occurred while retrieving analytics: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get financial statistics
        /// </summary>
        [HttpGet("financial")]
        public async Task<ActionResult<ApiResponse<FinancialStatsDto>>> GetFinancialStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetFinancialStatsAsync(filter);
                return Ok(ApiResponse<FinancialStatsDto>.SuccessResult(result, "Financial statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<FinancialStatsDto>.ErrorResult($"An error occurred while retrieving financial statistics: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get match statistics
        /// </summary>
        [HttpGet("matches")]
        public async Task<ActionResult<ApiResponse<MatchStatsDto>>> GetMatchStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetMatchStatsAsync(filter);
                return Ok(ApiResponse<MatchStatsDto>.SuccessResult(result, "Match statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<MatchStatsDto>.ErrorResult($"An error occurred while retrieving match statistics: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get personnel statistics
        /// </summary>
        [HttpGet("personnel")]
        public async Task<ActionResult<ApiResponse<PersonnelStatsDto>>> GetPersonnelStats(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetPersonnelStatsAsync(filter);
                return Ok(ApiResponse<PersonnelStatsDto>.SuccessResult(result, "Personnel statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<PersonnelStatsDto>.ErrorResult($"An error occurred while retrieving personnel statistics: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get monthly trends
        /// </summary>
        [HttpGet("trends")]
        public async Task<ActionResult<ApiResponse<List<MonthlyTrendDto>>>> GetMonthlyTrends(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetMonthlyTrendsAsync(filter);
                return Ok(ApiResponse<List<MonthlyTrendDto>>.SuccessResult(result, "Monthly trends retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<MonthlyTrendDto>>.ErrorResult($"An error occurred while retrieving monthly trends: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get top stadiums
        /// </summary>
        [HttpGet("top-stadiums")]
        public async Task<ActionResult<ApiResponse<List<TopStadiumDto>>>> GetTopStadiums(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status,
            [FromQuery] int limit = 10)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetTopStadiumsAsync(filter, limit);
                return Ok(ApiResponse<List<TopStadiumDto>>.SuccessResult(result, "Top stadiums retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<TopStadiumDto>>.ErrorResult($"An error occurred while retrieving top stadiums: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get top teams
        /// </summary>
        [HttpGet("top-teams")]
        public async Task<ActionResult<ApiResponse<List<TopTeamDto>>>> GetTopTeams(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status,
            [FromQuery] int limit = 10)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetTopTeamsAsync(filter, limit);
                return Ok(ApiResponse<List<TopTeamDto>>.SuccessResult(result, "Top teams retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<TopTeamDto>>.ErrorResult($"An error occurred while retrieving top teams: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get status distribution for pie chart
        /// </summary>
        [HttpGet("status-distribution")]
        public async Task<ActionResult<ApiResponse<List<StatusDistributionDto>>>> GetStatusDistribution(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type
                };

                var result = await _analyticsService.GetStatusDistributionAsync(filter);
                return Ok(ApiResponse<List<StatusDistributionDto>>.SuccessResult(result, "Status distribution retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<StatusDistributionDto>>.ErrorResult($"An error occurred while retrieving status distribution: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get revenue vs profit monthly trend
        /// </summary>
        [HttpGet("revenue-profit-trend")]
        public async Task<ActionResult<ApiResponse<List<MonthlyFinancialTrendDto>>>> GetRevenueProfitTrend(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetRevenueProfitTrendAsync(filter);
                return Ok(ApiResponse<List<MonthlyFinancialTrendDto>>.SuccessResult(result, "Revenue profit trend retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<MonthlyFinancialTrendDto>>.ErrorResult($"An error occurred while retrieving revenue profit trend: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get match type distribution
        /// </summary>
        [HttpGet("match-type-distribution")]
        public async Task<ActionResult<ApiResponse<List<MatchTypeDistributionDto>>>> GetMatchTypeDistribution(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Status = status
                };

                var result = await _analyticsService.GetMatchTypeDistributionAsync(filter);
                return Ok(ApiResponse<List<MatchTypeDistributionDto>>.SuccessResult(result, "Match type distribution retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<MatchTypeDistributionDto>>.ErrorResult($"An error occurred while retrieving match type distribution: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get detailed cancelled analysis
        /// </summary>
        [HttpGet("cancelled-analysis")]
        public async Task<ActionResult<ApiResponse<CancelledAnalysisDto>>> GetCancelledAnalysis(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type
                };

                var result = await _analyticsService.GetCancelledAnalysisAsync(filter);
                return Ok(ApiResponse<CancelledAnalysisDto>.SuccessResult(result, "Cancelled analysis retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<CancelledAnalysisDto>.ErrorResult($"An error occurred while retrieving cancelled analysis: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get photographer and cameraman analysis
        /// </summary>
        [HttpGet("photographer-cameraman-analysis")]
        public async Task<ActionResult<ApiResponse<PhotoCameraAnalysisDto>>> GetPhotographerCameramanAnalysis(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string? stadium,
            [FromQuery] string? team,
            [FromQuery] string? type,
            [FromQuery] string? status)
        {
            try
            {
                var filter = new AnalyticsFilterDto
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Stadium = stadium,
                    Team = team,
                    Type = type,
                    Status = status
                };

                var result = await _analyticsService.GetPhotographerCameramanAnalysisAsync(filter);
                return Ok(ApiResponse<PhotoCameraAnalysisDto>.SuccessResult(result, "Photographer cameraman analysis retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<PhotoCameraAnalysisDto>.ErrorResult($"An error occurred while retrieving photographer cameraman analysis: {ex.Message}"));
            }
        }
    }
}
