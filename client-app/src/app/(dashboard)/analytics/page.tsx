'use client'

import { AnalysisCard } from '@/components/ui/analysis-card'
import { ChartCard } from '@/components/ui/chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, DollarSign, BarChart3, Eye, MousePointer, Clock, Target } from 'lucide-react'

export default function AnalyticsPage() {
  // Mock analytics data
  const pageViewsData = [
    {
      name: 'Page Views',
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 6000, 4200, 3800, 5200, 6800]
    }
  ]

  const userActivityData = [
    {
      name: 'Active Users',
      data: [300, 450, 600, 800, 400, 600, 900, 1200, 850, 760, 1040, 1360]
    },
    {
      name: 'New Users',
      data: [150, 225, 300, 400, 200, 300, 450, 600, 425, 380, 520, 680]
    }
  ]

  const deviceUsageData = [
    { name: 'Desktop', y: 45 },
    { name: 'Mobile', y: 35 },
    { name: 'Tablet', y: 20 }
  ]

  const conversionFunnelData = [
    {
      name: 'Conversion Rate',
      data: [2.5, 3.2, 2.8, 4.1, 3.8, 4.5, 5.2, 4.8, 5.1, 4.9, 5.8, 6.2]
    }
  ]

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const topPages = [
    { page: '/dashboard', views: 12580, uniqueViews: 8450, bounceRate: '32%' },
    { page: '/analytics', views: 8940, uniqueViews: 6230, bounceRate: '28%' },
    { page: '/calendar', views: 6750, uniqueViews: 4890, bounceRate: '35%' },
    { page: '/football-matches', views: 5420, uniqueViews: 3980, bounceRate: '40%' },
    { page: '/projects', views: 4230, uniqueViews: 3140, bounceRate: '38%' }
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 15420, percentage: 45 },
    { source: 'Google Search', visitors: 12340, percentage: 36 },
    { source: 'Social Media', visitors: 4230, percentage: 12 },
    { source: 'Referral', visitors: 2410, percentage: 7 }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AnalysisCard
          title="Total Page Views"
          value="125.6k"
          subtitle="This month"
          icon={<Eye className="h-4 w-4" />}
          trend={{ value: 18, isPositive: true }}
          color="blue"
        />
        <AnalysisCard
          title="Unique Visitors"
          value="42.3k"
          subtitle="Active users"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <AnalysisCard
          title="Avg. Session Duration"
          value="3m 42s"
          subtitle="Per session"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
        <AnalysisCard
          title="Conversion Rate"
          value="6.2%"
          subtitle="Goal completion"
          icon={<Target className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
          color="orange"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard
          title="Page Views Trend"
          type="area"
          data={pageViewsData}
          categories={categories}
          height={300}
          colors={['#3B82F6']}
        />
        <ChartCard
          title="User Activity"
          type="line"
          data={userActivityData}
          categories={categories}
          height={300}
          colors={['#10B981', '#8B5CF6']}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard
          title="Device Usage"
          type="pie"
          data={deviceUsageData}
          height={300}
          colors={['#3B82F6', '#10B981', '#F59E0B']}
        />
        <ChartCard
          title="Conversion Rate"
          type="column"
          data={conversionFunnelData}
          categories={categories}
          height={300}
          colors={['#EF4444']}
        />
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.uniqueViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Bounce: {page.bounceRate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {source.source[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.visitors.toLocaleString()} visitors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{source.percentage}%</p>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AnalysisCard
          title="Bounce Rate"
          value="34.2%"
          subtitle="Average bounce rate"
          icon={<MousePointer className="h-4 w-4" />}
          trend={{ value: 3, isPositive: false }}
          color="yellow"
        />
        <AnalysisCard
          title="Pages per Session"
          value="4.8"
          subtitle="Average pages"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <AnalysisCard
          title="Revenue per User"
          value="$42.30"
          subtitle="Average RPU"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 18, isPositive: true }}
          color="orange"
        />
        <AnalysisCard
          title="Goal Completions"
          value="1,284"
          subtitle="This month"
          icon={<Target className="h-4 w-4" />}
          trend={{ value: 25, isPositive: true }}
          color="purple"
        />
      </div>
    </div>
  )
}
