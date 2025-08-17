'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TopStadiumsProps {
  data: Array<{
    stadium: string
    matchCount: number
    totalRevenue: number
    totalProfit: number
    averageRevenue: number
  }>
  title?: string
  limit?: number
}

export const TopStadiums: React.FC<TopStadiumsProps> = ({ 
  data = [], // Default to empty array
  title = "Top Stadiums by Revenue",
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
          {displayData.map((stadium, index) => (
            <div 
              key={stadium.stadium} 
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{stadium.stadium}</p>
                  <p className="text-xs text-muted-foreground">
                    {stadium.matchCount} matches
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(stadium.totalRevenue)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Avg: {formatCurrency(stadium.averageRevenue)}
                  </p>
                  <Badge 
                    variant={stadium.totalProfit > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stadium.totalProfit > 0 ? '+' : ''}{formatCurrency(stadium.totalProfit)}
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
