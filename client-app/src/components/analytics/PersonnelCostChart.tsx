'use client'

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface PersonnelCostChartProps {
  data: Array<{
    month: string
    photographerCost: number
    cameramanCost: number
    matchCount: number
  }>
  title?: string
}

export const PersonnelCostChart: React.FC<PersonnelCostChartProps> = ({ 
  data = [], // Default to empty array
  title = "Personnel Costs by Month" 
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
      categories: data.map(d => {
        const [year, month] = d.month.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      }),
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: 'Cost (VND)',
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
      shared: true,
      formatter: function() {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points?.forEach(point => {
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${Highcharts.numberFormat(point.y as number, 0, '.', ',')}</b> VND<br/>`;
        });
        const matchCount = data[this.points?.[0]?.point?.index || 0]?.matchCount || 0;
        tooltip += `Matches: <b>${matchCount}</b>`;
        return tooltip;
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
    series: [
      {
        name: 'Photographer',
        type: 'column',
        data: data.map(d => d.photographerCost),
        color: '#f59e0b'
      },
      {
        name: 'Cameraman',
        type: 'column',
        data: data.map(d => d.cameramanCost),
        color: '#8b5cf6'
      }
    ],
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
