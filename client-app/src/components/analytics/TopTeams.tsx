'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TopTeamsProps {
  data: Array<{
    team: string
    matchCount: number
    totalRevenue: number
    totalProfit: number
    averageRevenue: number
  }>
  title?: string
  limit?: number
}

export const TopTeams: React.FC<TopTeamsProps> = ({ 
  data = [], // Default to empty array
  title = "Top Teams by Revenue",
  limit = 5
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const displayData = data.slice(0, limit);

  // Early return if no data
  if (!displayData || displayData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayData.map((team, index) => (
            <div 
              key={team.team} 
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{team.team}</p>
                  <p className="text-xs text-muted-foreground">
                    {team.matchCount} matches
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(team.totalRevenue)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Avg: {formatCurrency(team.averageRevenue)}
                  </p>
                  <Badge 
                    variant={team.totalProfit > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {team.totalProfit > 0 ? '+' : ''}{formatCurrency(team.totalProfit)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
