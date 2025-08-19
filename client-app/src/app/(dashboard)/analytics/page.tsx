"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Calendar } from "lucide-react";
import { AnalyticsFilterComponent } from "@/components/analytics/AnalyticsFilter";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { FinancialTrendChart } from "@/components/analytics/FinancialTrendChart";
import { StatusPieChart } from "@/components/analytics/StatusPieChart";
import { RevenueBarChart } from "@/components/analytics/RevenueBarChart";
import { PersonnelCostChart } from "@/components/analytics/PersonnelCostChart";
import { MatchTypeChart } from "@/components/analytics/MatchTypeChart";
import { TopStadiums } from "@/components/analytics/TopStadiums";
import { TopTeams } from "@/components/analytics/TopTeams";
import {
  analyticsService,
  type AnalyticsFilter,
  type AnalyticsDashboard,
  type StatusDistribution,
  type MonthlyFinancialTrend,
  type MatchTypeDistribution,
  type PhotoCameraAnalysis,
} from "@/services/analyticsService";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<AnalyticsFilter>({});
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboard | null>(
    null
  );
  const [statusDistribution, setStatusDistribution] = useState<
    StatusDistribution[]
  >([]);
  const [revenueProfitTrend, setRevenueProfitTrend] = useState<
    MonthlyFinancialTrend[]
  >([]);
  const [matchTypeDistribution, setMatchTypeDistribution] = useState<
    MatchTypeDistribution[]
  >([]);
  const [personnelAnalysis, setPersonnelAnalysis] =
    useState<PhotoCameraAnalysis | null>(null);

  const loadAnalyticsData = async (currentFilter: AnalyticsFilter = {}) => {
    try {
      setLoading(true);
      // Load all data in parallel with better error handling
      const results = await Promise.allSettled([
        analyticsService.getDashboardAnalytics(currentFilter),
        analyticsService.getStatusDistribution(currentFilter),
        analyticsService.getRevenueProfitTrend(currentFilter),
        analyticsService.getMatchTypeDistribution(currentFilter),
        analyticsService.getPhotographerCameramanAnalysis(currentFilter),
      ]);

      // Handle results with proper error checking
      if (results[0].status === "fulfilled") {
        setDashboardData(results[0].value);
      } else {
        console.error("❌ Dashboard data failed:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        setStatusDistribution(results[1].value);
      } else {
        console.error("❌ Status distribution failed:", results[1].reason);
      }

      if (results[2].status === "fulfilled") {
        setRevenueProfitTrend(results[2].value);
      } else {
        console.error("❌ Revenue profit trend failed:", results[2].reason);
      }

      if (results[3].status === "fulfilled") {
        setMatchTypeDistribution(results[3].value);
      } else {
        console.error("❌ Match type distribution failed:", results[3].reason);
      }

      if (results[4].status === "fulfilled") {
        setPersonnelAnalysis(results[4].value);
      } else {
        console.error("❌ Personnel analysis failed:", results[4].reason);
      }

      // Log any failed requests
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Analytics request ${index} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: AnalyticsFilter) => {
    setFilter(newFilter);
    loadAnalyticsData(newFilter);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData(filter);
    setRefreshing(false);
  };

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log("Export analytics data");
  };

  useEffect(() => {
    // Try loading with explicit empty filter first
    loadAnalyticsData({}); // Explicit empty object
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  // Only show "No data available" if ALL data is missing, not just dashboardData
  const hasAnyData =
    dashboardData ||
    statusDistribution.length > 0 ||
    revenueProfitTrend.length > 0 ||
    matchTypeDistribution.length > 0 ||
    personnelAnalysis;

  if (!hasAnyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
          <Button onClick={() => loadAnalyticsData()} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Phần tiêu đề */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            {dashboardData?.period || "All Time"} • Generated at{" "}
            {dashboardData?.generatedAt
              ? new Date(dashboardData.generatedAt).toLocaleString()
              : new Date().toLocaleString()}
          </p>
        </div>

        {/* Nhóm nút */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilterComponent
        onFilterChange={handleFilterChange}
        initialFilter={filter}
      />

      {/* Key Metrics */}
      {dashboardData && (
        <AnalyticsStats
          financialStats={dashboardData.financialStats}
          matchStats={dashboardData.matchStats}
          personnelStats={dashboardData.personnelStats}
        />
      )}

      {/* Financial Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FinancialTrendChart
          data={revenueProfitTrend}
          title="Revenue vs Profit Trend"
        />
        <RevenueBarChart
          data={dashboardData?.monthlyTrends || []}
          title="Monthly Revenue"
        />
      </div>

      {/* Status and Type Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StatusPieChart
          data={statusDistribution}
          title="Match Status Distribution"
        />
        <MatchTypeChart
          data={matchTypeDistribution}
          title="Match Type Distribution"
        />
      </div>

      {/* Personnel Analysis */}
      {personnelAnalysis && (
        <div className="grid grid-cols-1 gap-6">
          <PersonnelCostChart
            data={personnelAnalysis.monthlyCosts}
            title="Personnel Costs by Month"
          />
        </div>
      )}

      {/* Top Performers */}
      {dashboardData && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopStadiums
            data={dashboardData.topStadiums}
            title="Top 5 Stadiums by Revenue"
            limit={5}
          />
          <TopTeams
            data={dashboardData.topTeams}
            title="Top 5 Teams by Revenue"
            limit={5}
          />
        </div>
      )}

      {/* Additional Insights */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                💰 Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Revenue
                  </span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(dashboardData.financialStats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Cost
                  </span>
                  <span className="font-semibold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(dashboardData.financialStats.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Net Profit</span>
                  <span
                    className={`font-bold ${
                      dashboardData.financialStats.totalProfit > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(dashboardData.financialStats.totalProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Profit Margin
                  </span>
                  <span
                    className={`font-semibold ${
                      dashboardData.financialStats.profitMargin > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {dashboardData.financialStats.profitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                ⚽ Match Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Matches
                  </span>
                  <span className="font-semibold">
                    {dashboardData.matchStats.totalMatches}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">✅ Completed</span>
                  <span className="font-semibold">
                    {dashboardData.matchStats.completedMatches}(
                    {dashboardData.matchStats.completedPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-600">⏳ Pending</span>
                  <span className="font-semibold">
                    {dashboardData.matchStats.pendingMatches}(
                    {dashboardData.matchStats.pendingPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-red-600">❌ Cancelled</span>
                  <span className="font-semibold">
                    {dashboardData.matchStats.cancelledMatches}(
                    {dashboardData.matchStats.cancelledPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel Summary */}
          {personnelAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  📷 Personnel Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Photographer Cost
                    </span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(personnelAnalysis.totalPhotographerCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Cameraman Cost
                    </span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(personnelAnalysis.totalCameramanCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Photographer Rate
                    </span>
                    <span className="font-semibold">
                      {personnelAnalysis.photographerRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Cameraman Rate
                    </span>
                    <span className="font-semibold">
                      {personnelAnalysis.cameramanRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
