"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MatchTypeChartProps {
  data: Array<{
    type: string;
    count: number;
    revenue: number;
    percentage: number;
    color: string;
  }>;
  title?: string;
}

export const MatchTypeChart: React.FC<MatchTypeChartProps> = ({
  data = [], // Default to empty array
  title = "Match Type Distribution",
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
    );
  }
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat:
        "<b>{point.y}</b> matches ({point.percentage:.1f}%)<br/>" +
        "Revenue: <b>{point.revenue}</b> VND",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            fontSize: "12px",
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Match Types",
        type: "pie",
        data: data.map((item) => ({
          name: item.type,
          y: item.count,
          color: item.color,
        })),
      },
    ],
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: "350px" } }}
        />
      </CardContent>
    </Card>
  );
};
