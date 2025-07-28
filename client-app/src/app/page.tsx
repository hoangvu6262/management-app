'use client'

import { AnalysisCard } from '@/components/ui/analysis-card'
import { ChartCard } from '@/components/ui/chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, DollarSign, BarChart3, Smartphone, Headphones, ShoppingCart } from 'lucide-react'

export default function DashboardPage() {
  // Mock data for charts
  const lineChartData = [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 85, 100, 120]
    },
    {
      name: 'Distribution',
      data: [20, 30, 25, 40, 39, 50, 60, 81, 105, 75, 90, 110]
    },
    {
      name: 'Return',
      data: [10, 15, 12, 20, 19, 25, 30, 41, 55, 35, 45, 60]
    }
  ]

  const pieChartData = [
    { name: 'Sales', y: 80 },
    { name: 'Distribution', y: 15 },
    { name: 'Return', y: 5 }
  ]

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const topProducts = [
    {
      id: 1,
      name: 'Nike Shoes Black Pattern',
      code: '587',
      price: '$87',
      sales: 423,
      revenue: '$36,801'
    },
    {
      id: 2,
      name: 'iPhone 12',
      code: '$987',
      price: '$987',
      sales: 234,
      revenue: '$230,958'
    }
  ]

  const recentOrders = [
    {
      id: '#87651',
      customer: 'Emma Liam',
      date: '$174',
      status: 'Complete',
      revenue: '$1,48'
    },
    {
      id: '#87652',
      customer: 'David Wilson',
      date: '$84',
      status: 'Pending',
      revenue: '$1,48'
    },
    {
      id: '#87653',
      customer: 'Sarah Johnson',
      date: '$274',
      status: 'Complete',
      revenue: '$1,48'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AnalysisCard
          title="Total Visitors"
          value="178k"
          subtitle="Free Members"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <AnalysisCard
          title="Total Orders"
          value="20+"
          subtitle="Top Products"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
          color="yellow"
        />
        <AnalysisCard
          title="Total Sales"
          value="190+"
          subtitle="Weekly sales"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
          color="orange"
        />
        <AnalysisCard
          title="Total Revenue"
          value="12k"
          subtitle="Total Revenue"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2">
          <ChartCard
            title="Reports"
            type="area"
            data={lineChartData}
            categories={categories}
            height={350}
          />
        </div>
        <div>
          <ChartCard
            title="Analytics"
            type="donut"
            data={pieChartData}
            height={350}
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.date}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Complete' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      {product.name.includes('Nike') ? (
                        <div className="text-white text-xs">👟</div>
                      ) : (
                        <Smartphone className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.price}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
