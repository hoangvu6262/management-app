'use client'

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface RevenueBarChartProps {
  data: Array<{
    month: string
    monthName: string
    revenue: number
    matchCount: number
  }>
  title?: string
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({ 
  data = [], // Default to empty array
  title = "Monthly Revenue" 
}) => {
  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: data.map(d => d.monthName),
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: 'Revenue (VND)',
        style: { color: '#64748b' }
      },
      labels: {
        formatter: function() {
          return Highcharts.numberFormat(this.value as number, 0, '.', ',');
        }
      },
      gridLineColor: '#f1f5f9',
    },
    tooltip: {
      formatter: function() {
        const matchCount = data[this.point.index]?.matchCount || 0;
        return `<b>${this.x}</b><br/>` +
               `Revenue: <b>${Highcharts.numberFormat(this.y as number, 0, '.', ',')}</b> VND<br/>` +
               `Matches: <b>${matchCount}</b>`;
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [{
      name: 'Revenue',
      type: 'column',
      data: data.map(d => d.revenue),
      color: '#3b82f6'
    }],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: '350px' } }}
        />
      </CardContent>
    </Card>
  )
}
