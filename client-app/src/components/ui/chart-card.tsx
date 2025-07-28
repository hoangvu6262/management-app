import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface ChartCardProps {
  title: string;
  type: "line" | "area" | "column" | "pie" | "donut";
  data: any[];
  categories?: string[];
  height?: number;
  className?: string;
  colors?: string[];
}

export function ChartCard({
  title,
  type,
  data,
  categories,
  height = 300,
  className,
  colors = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"],
}: ChartCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getChartOptions = (): Highcharts.Options => {
    const baseOptions: Highcharts.Options = {
      chart: {
        type: type === "donut" ? "pie" : type,
        height,
        backgroundColor: "transparent",
        style: {
          fontFamily: "inherit",
        },
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      colors,
      plotOptions: {
        series: {
          animation: {
            duration: 1000,
          },
        },
        pie: {
          innerSize: type === "donut" ? "60%" : "0%",
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
        line: {
          marker: {
            radius: 4,
          },
        },
        area: {
          fillOpacity: 0.3,
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        itemStyle: {
          color: isDark ? "#e5e7eb" : "#374151",
          fontSize: "12px",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        style: {
          color: isDark ? "#e5e7eb" : "#374151",
        },
      },
    };

    if (type === "pie" || type === "donut") {
      baseOptions.series = [
        {
          type: "pie",
          data: data,
          name: "Value",
        },
      ];
    } else {
      baseOptions.xAxis = {
        categories,
        labels: {
          style: {
            color: isDark ? "#9ca3af" : "#6b7280",
          },
        },
        lineColor: isDark ? "#4b5563" : "#e5e7eb",
        tickColor: isDark ? "#4b5563" : "#e5e7eb",
      };

      baseOptions.yAxis = {
        title: {
          text: undefined,
        },
        labels: {
          style: {
            color: isDark ? "#9ca3af" : "#6b7280",
          },
        },
        gridLineColor: isDark ? "#374151" : "#f3f4f6",
        lineColor: isDark ? "#4b5563" : "#e5e7eb",
        tickColor: isDark ? "#4b5563" : "#e5e7eb",
      };

      baseOptions.series = data;
    }

    return baseOptions;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
