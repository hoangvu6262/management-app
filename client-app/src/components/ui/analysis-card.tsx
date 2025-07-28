import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnalysisCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'purple' | 'orange' | 'green' | 'yellow'
  className?: string
}

export function AnalysisCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  className
}: AnalysisCardProps) {
  const colorVariants = {
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500',
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
  }

  const iconColorVariants = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
    green: 'text-green-500 bg-green-50 dark:bg-green-950',
    yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950',
  }

  return (
    <Card className={cn(
      "border-l-4 transition-all hover:shadow-md",
      colorVariants[color],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            iconColorVariants[color]
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
