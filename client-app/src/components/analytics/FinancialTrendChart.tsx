'use client'

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface FinancialTrendChartProps {
  data: Array<{
    month: string
    monthName: string
    revenue: number
    profit: number
    matchCount: number
  }>
  title?: string
}

export const FinancialTrendChart: React.FC<FinancialTrendChartProps> = ({ 
  data = [], // Default to empty array
  title = "Revenue vs Profit Trend" 
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
      type: 'line',
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: data.map(d => d.monthName),
      gridLineWidth: 1,
      gridLineColor: '#f1f5f9',
    },
    yAxis: [
      {
        title: {
          text: 'Amount (VND)',
          style: { color: '#64748b' }
        },
        labels: {
          formatter: function() {
            return Highcharts.numberFormat(this.value as number, 0, '.', ',');
          }
        },
        gridLineColor: '#f1f5f9',
      }
    ],
    tooltip: {
      shared: true,
      formatter: function() {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points?.forEach(point => {
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${Highcharts.numberFormat(point.y as number, 0, '.', ',')}</b> VND<br/>`;
        });
        return tooltip;
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: data.map(d => d.revenue),
        color: '#3b82f6',
        marker: {
          enabled: true,
          radius: 4
        }
      },
      {
        name: 'Profit',
        type: 'line',
        data: data.map(d => d.profit),
        color: '#10b981',
        marker: {
          enabled: true,
          radius: 4
        }
      }
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: true
      }
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
