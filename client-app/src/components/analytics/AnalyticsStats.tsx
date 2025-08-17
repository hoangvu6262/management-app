'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Activity } from 'lucide-react'
import type { FinancialStats, MatchStats, PersonnelStats } from '@/services/analyticsService'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange'
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500', 
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val > 1000000) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      }
      return val.toLocaleString();
    }
    return val;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full ${colorClasses[color]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnalyticsStatsProps {
  financialStats: FinancialStats
  matchStats: MatchStats
  personnelStats: PersonnelStats
}

export const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({
  financialStats,
  matchStats,
  personnelStats
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Financial Stats */}
      <StatCard
        title="Total Revenue"
        value={financialStats.totalRevenue}
        subtitle="All time revenue"
        icon={<DollarSign className="h-6 w-6" />}
        color="green"
      />
      
      <StatCard
        title="Total Profit"
        value={financialStats.totalProfit}
        subtitle={`${financialStats.profitMargin.toFixed(1)}% margin`}
        icon={<TrendingUp className="h-6 w-6" />}
        color="blue"
      />
      
      <StatCard
        title="Total Matches"
        value={matchStats.totalMatches}
        subtitle={`${matchStats.completedPercentage.toFixed(1)}% completed`}
        icon={<Activity className="h-6 w-6" />}
        color="purple"
      />
      
      <StatCard
        title="Avg Revenue/Match"
        value={financialStats.averageRevenuePerMatch}
        subtitle="Per match average"
        icon={<Target className="h-6 w-6" />}
        color="orange"
      />
      
      {/* Additional Row */}
      <StatCard
        title="Total Cost"
        value={financialStats.totalCost}
        subtitle="Including personnel"
        icon={<DollarSign className="h-6 w-6" />}
        color="red"
      />
      
      <StatCard
        title="Personnel Costs"
        value={personnelStats.totalPhotographerCost + personnelStats.totalCameramanCost}
        subtitle="Photographer + Cameraman"
        icon={<Users className="h-6 w-6" />}
        color="yellow"
      />
      
      <StatCard
        title="Completed Matches"
        value={matchStats.completedMatches}
        subtitle={`${matchStats.pendingMatches} pending`}
        icon={<Activity className="h-6 w-6" />}
        color="green"
      />
      
      <StatCard
        title="Avg Profit/Match"
        value={financialStats.averageProfitPerMatch}
        subtitle="Per match profit"
        icon={<TrendingUp className="h-6 w-6" />}
        color="blue"
      />
    </div>
  )
}
