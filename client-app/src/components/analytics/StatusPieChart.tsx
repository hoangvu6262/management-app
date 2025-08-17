'use client'

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface StatusPieChartProps {
  data: Array<{
    status: string
    count: number
    percentage: number
    color: string
  }>
  title?: string
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ 
  data = [], // Default to empty array
  title = "Match Status Distribution" 
}) => {
  // Early return if no data
  if (!data || data.length === 0) {
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

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> matches ({point.percentage:.1f}%)'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            fontSize: '12px'
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Matches',
      type: 'pie',
      data: data.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
        y: item.count,
        color: item.color
      }))
    }],
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
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
