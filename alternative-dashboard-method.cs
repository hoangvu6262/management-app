// Alternative Solution: Use DbContext Factory for parallel operations
// This approach allows safe parallel execution with separate DbContext instances

public async Task<AnalyticsDashboardDto> GetDashboardAnalyticsAsync(AnalyticsFilterDto filter)
{
    try
    {
        // Option A: Execute sequentially (safer, simpler)
        var financialStats = await GetFinancialStatsAsync(filter);
        var matchStats = await GetMatchStatsAsync(filter);
        var personnelStats = await GetPersonnelStatsAsync(filter);
        var monthlyTrends = await GetMonthlyTrendsAsync(filter);
        var topStadiums = await GetTopStadiumsAsync(filter, 5);
        var topTeams = await GetTopTeamsAsync(filter, 5);

        var period = GetPeriodDescription(filter);

        return new AnalyticsDashboardDto
        {
            FinancialStats = financialStats,
            MatchStats = matchStats,
            PersonnelStats = personnelStats,
            MonthlyTrends = monthlyTrends,
            TopStadiums = topStadiums,
            TopTeams = topTeams,
            Period = period,
            GeneratedAt = DateTime.UtcNow
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in GetDashboardAnalyticsAsync: {ex.Message}");
        
        // Return empty dashboard on error instead of throwing
        return new AnalyticsDashboardDto
        {
            FinancialStats = new FinancialStatsDto(),
            MatchStats = new MatchStatsDto(),
            PersonnelStats = new PersonnelStatsDto(),
            MonthlyTrends = new List<MonthlyTrendDto>(),
            TopStadiums = new List<TopStadiumDto>(),
            TopTeams = new List<TopTeamDto>(),
            Period = "Error",
            GeneratedAt = DateTime.UtcNow
        };
    }
}
