import { protectedApi } from "./protectedApi";

export interface AnalyticsFilter {
  fromDate?: string;
  toDate?: string;
  stadium?: string;
  team?: string;
  type?: string;
  status?: string;
}

export interface FinancialStats {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  averageRevenuePerMatch: number;
  averageProfitPerMatch: number;
  totalDiscount: number;
  discountPercentage: number;
}

export interface MatchStats {
  totalMatches: number;
  completedMatches: number;
  pendingMatches: number;
  cancelledMatches: number;
  completedPercentage: number;
  pendingPercentage: number;
  cancelledPercentage: number;
}

export interface PersonnelStats {
  totalPhotographerCost: number;
  totalCameramanCost: number;
  averagePhotographerCostPerMatch: number;
  averageCameramanCostPerMatch: number;
  matchesWithPhotographer: number;
  matchesWithCameraman: number;
  photographerParticipationRate: number;
  cameramanParticipationRate: number;
}

export interface MonthlyTrend {
  month: string;
  monthName: string;
  revenue: number;
  cost: number;
  profit: number;
  matchCount: number;
}

export interface TopStadium {
  stadium: string;
  matchCount: number;
  totalRevenue: number;
  totalProfit: number;
  averageRevenue: number;
}

export interface TopTeam {
  team: string;
  matchCount: number;
  totalRevenue: number;
  totalProfit: number;
  averageRevenue: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyFinancialTrend {
  month: string;
  monthName: string;
  revenue: number;
  profit: number;
  matchCount: number;
}

export interface MatchTypeDistribution {
  type: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface CancelledAnalysis {
  totalMatches: number;
  cancelledCount: number;
  cancellationRate: number;
  lostRevenue: number;
  monthlyData: CancelledByMonth[];
  reasonAnalysis: CancelledByReason[];
}

export interface CancelledByMonth {
  month: string;
  cancelledCount: number;
  totalCount: number;
  rate: number;
}

export interface CancelledByReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface PhotoCameraAnalysis {
  totalPhotographerCost: number;
  totalCameramanCost: number;
  totalMatches: number;
  matchesWithPhotographer: number;
  matchesWithCameraman: number;
  matchesWithBoth: number;
  photographerRate: number;
  cameramanRate: number;
  bothRate: number;
  monthlyCosts: MonthlyPersonnelCost[];
}

export interface MonthlyPersonnelCost {
  month: string;
  photographerCost: number;
  cameramanCost: number;
  matchCount: number;
}

export interface AnalyticsDashboard {
  financialStats: FinancialStats;
  matchStats: MatchStats;
  personnelStats: PersonnelStats;
  monthlyTrends: MonthlyTrend[];
  topStadiums: TopStadium[];
  topTeams: TopTeam[];
  generatedAt: string;
  period: string;
}

class AnalyticsService {
  private buildQueryParams(filter: AnalyticsFilter): string {
    const params = new URLSearchParams();

    if (filter.fromDate) params.append("fromDate", filter.fromDate);
    if (filter.toDate) params.append("toDate", filter.toDate);
    if (filter.stadium) params.append("stadium", filter.stadium);
    if (filter.team) params.append("team", filter.team);
    if (filter.type) params.append("type", filter.type);
    if (filter.status) params.append("status", filter.status);

    return params.toString();
  }

  async getDashboardAnalytics(
    filter: AnalyticsFilter = {}
  ): Promise<AnalyticsDashboard> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/dashboard?${queryParams}`
      );
      return response.data || response; // Handle both nested and direct data
    } catch (error) {
      console.error("Failed to load dashboard analytics:", error);
      // Return empty/default data structure on error
      return this.getEmptyDashboard();
    }
  }

  async getFinancialStats(
    filter: AnalyticsFilter = {}
  ): Promise<FinancialStats> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/financial?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load financial stats:", error);
      return this.getEmptyDashboard().financialStats;
    }
  }

  async getMatchStats(filter: AnalyticsFilter = {}): Promise<MatchStats> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/matches?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load match stats:", error);
      return this.getEmptyDashboard().matchStats;
    }
  }

  async getPersonnelStats(
    filter: AnalyticsFilter = {}
  ): Promise<PersonnelStats> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/personnel?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load personnel stats:", error);
      return this.getEmptyDashboard().personnelStats;
    }
  }

  async getMonthlyTrends(
    filter: AnalyticsFilter = {}
  ): Promise<MonthlyTrend[]> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/trends?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load monthly trends:", error);
      return [];
    }
  }

  async getTopStadiums(
    filter: AnalyticsFilter = {},
    limit: number = 10
  ): Promise<TopStadium[]> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const params = queryParams
        ? `${queryParams}&limit=${limit}`
        : `limit=${limit}`;
      const response = await protectedApi.get(
        `/analytics/top-stadiums?${params}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load top stadiums:", error);
      return [];
    }
  }

  async getTopTeams(
    filter: AnalyticsFilter = {},
    limit: number = 10
  ): Promise<TopTeam[]> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const params = queryParams
        ? `${queryParams}&limit=${limit}`
        : `limit=${limit}`;
      const response = await protectedApi.get(`/analytics/top-teams?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to load top teams:", error);
      return [];
    }
  }

  async getStatusDistribution(
    filter: AnalyticsFilter = {}
  ): Promise<StatusDistribution[]> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/status-distribution?${queryParams}`
      );
      // Handle backend response structure: { data: [...], message: ..., errors: ... }
      return response || [];
    } catch (error) {
      console.error("Failed to load status distribution:", error);
      return [];
    }
  }

  async getRevenueProfitTrend(
    filter: AnalyticsFilter = {}
  ): Promise<MonthlyFinancialTrend[]> {
    try {
      const queryParams = this.buildQueryParams(filter);

      const response = await protectedApi.get(
        `/analytics/revenue-profit-trend?${queryParams}`
      );

      // Handle backend response structure: { data: [...], message: ..., errors: ... }
      const data = response || [];
      if (data.length === 0) {
        console.warn(
          "⚠️ Revenue profit trend returned empty array - check backend data or filters"
        );
      }

      return data;
    } catch (error) {
      console.error("Failed to load revenue profit trend:", error);
      return [];
    }
  }

  async getMatchTypeDistribution(
    filter: AnalyticsFilter = {}
  ): Promise<MatchTypeDistribution[]> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/match-type-distribution?${queryParams}`
      );
      // Handle backend response structure: { data: [...], message: ..., errors: ... }
      return response || [];
    } catch (error) {
      console.error("Failed to load match type distribution:", error);
      return [];
    }
  }

  async getCancelledAnalysis(
    filter: AnalyticsFilter = {}
  ): Promise<CancelledAnalysis> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/cancelled-analysis?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load cancelled analysis:", error);
      return {
        totalMatches: 0,
        cancelledCount: 0,
        cancellationRate: 0,
        lostRevenue: 0,
        monthlyData: [],
        reasonAnalysis: [],
      };
    }
  }

  async getPhotographerCameramanAnalysis(
    filter: AnalyticsFilter = {}
  ): Promise<PhotoCameraAnalysis> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await protectedApi.get(
        `/analytics/photographer-cameraman-analysis?${queryParams}`
      );
      // Handle backend response structure: { data: {...}, message: ..., errors: ... }
      return response || this.getEmptyPersonnelAnalysis();
    } catch (error) {
      console.error("Failed to load photographer cameraman analysis:", error);
      return this.getEmptyPersonnelAnalysis();
    }
  }

  // Helper method to return empty dashboard data
  private getEmptyDashboard(): AnalyticsDashboard {
    return {
      financialStats: {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        averageRevenuePerMatch: 0,
        averageProfitPerMatch: 0,
        totalDiscount: 0,
        discountPercentage: 0,
      },
      matchStats: {
        totalMatches: 0,
        completedMatches: 0,
        pendingMatches: 0,
        cancelledMatches: 0,
        completedPercentage: 0,
        pendingPercentage: 0,
        cancelledPercentage: 0,
      },
      personnelStats: {
        totalPhotographerCost: 0,
        totalCameramanCost: 0,
        averagePhotographerCostPerMatch: 0,
        averageCameramanCostPerMatch: 0,
        matchesWithPhotographer: 0,
        matchesWithCameraman: 0,
        photographerParticipationRate: 0,
        cameramanParticipationRate: 0,
      },
      monthlyTrends: [],
      topStadiums: [],
      topTeams: [],
      generatedAt: new Date().toISOString(),
      period: "No Data",
    };
  }

  private getEmptyPersonnelAnalysis(): PhotoCameraAnalysis {
    return {
      totalPhotographerCost: 0,
      totalCameramanCost: 0,
      totalMatches: 0,
      matchesWithPhotographer: 0,
      matchesWithCameraman: 0,
      matchesWithBoth: 0,
      photographerRate: 0,
      cameramanRate: 0,
      bothRate: 0,
      monthlyCosts: [],
    };
  }
}

export const analyticsService = new AnalyticsService();
