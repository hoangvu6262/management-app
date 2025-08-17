# Analytics Dashboard - ManagementApp

## 📊 Tổng quan

Analytics Dashboard cung cấp một cái nhìn toàn diện về hoạt động kinh doanh của ứng dụng quản lý bóng đá, bao gồm thống kê tài chính, hoạt động, và nhân sự.

## 🚀 Tính năng chính

### 📈 Thống kê tài chính
- **Tổng doanh thu (Total Revenue)** - Doanh thu tổng cộng trong khoảng thời gian
- **Tổng chi phí (Total Cost)** - Bao gồm cả chi phí nhân sự
- **Lợi nhuận gộp (Total Profit)** - Profit = Revenue - Cost
- **Tỷ suất lợi nhuận (Profit Margin %)** - Profit / Revenue * 100
- **So sánh Revenue/Profit theo tháng** - Biểu đồ xu hướng
- **Doanh thu trung bình mỗi trận** - Average Revenue per Match
- **Lợi nhuận trung bình mỗi trận** - Average Profit per Match

### ⚽ Thống kê hoạt động
- **Số trận đấu đã quản lý** - Theo tháng/năm
- **Phân loại theo Status**:
  - ✅ Completed - Đã hoàn thành
  - ⏳ Pending - Đang chờ
  - ❌ Cancelled - Đã hủy
- **Phân tích loại trận** - S5, S7, S11
- **Tỷ lệ phần trăm** - Completed/Pending/Cancelled

### 📷 Thống kê nhân sự & chi phí phụ
- **Tổng chi cho Photographer** - Chi phí quay phim
- **Tổng chi cho Cameraman** - Chi phí camera
- **Tỷ lệ tham gia** - Photographer/Cameraman participation rate
- **Chi phí trung bình** - Average cost per match
- **Biểu đồ chi phí nhân sự theo tháng**

### 🔍 Thống kê nâng cao
- **Top Stadiums** - Sân nào có nhiều trận và doanh thu cao nhất
- **Top Teams** - Đội nào thuê nhiều nhất
- **Discount Analysis** - Tổng số tiền giảm giá và % so với revenue
- **Cancelled Analysis** - Số trận hủy, % cancellation rate, lost revenue

## 📱 Giao diện Dashboard

### 1. Header & Controls
- **Title & Period** - Hiển thị khoảng thời gian và thời gian tạo báo cáo
- **Refresh Button** - Làm mới dữ liệu
- **Export Button** - Xuất báo cáo (future feature)

### 2. Filters
- **Date Range** - Từ ngày - đến ngày
- **Stadium** - Lọc theo sân
- **Team** - Lọc theo đội
- **Match Type** - S5, S7, S11
- **Status** - Completed, Pending, Cancelled

### 3. Key Metrics Cards
- 8 thẻ thống kê chính hiển thị các chỉ số quan trọng nhất
- Màu sắc theo loại: xanh lá (revenue), xanh dương (profit), tím (matches), cam (averages)

### 4. Charts & Visualizations

#### 📈 Financial Charts
- **Revenue vs Profit Trend** - Line chart so sánh doanh thu và lợi nhuận theo tháng
- **Monthly Revenue** - Bar chart doanh thu hàng tháng

#### 🥧 Distribution Charts  
- **Match Status Distribution** - Pie chart phân bổ trạng thái trận đấu
- **Match Type Distribution** - Pie chart phân bổ loại trận

#### 👥 Personnel Charts
- **Personnel Costs by Month** - Stacked column chart chi phí nhân sự

#### 🏆 Top Lists
- **Top 5 Stadiums** - Danh sách 5 sân có doanh thu cao nhất
- **Top 5 Teams** - Danh sách 5 đội thuê nhiều nhất

#### 📋 Summary Cards
- **Financial Summary** - Tóm tắt tài chính
- **Match Summary** - Tóm tắt trận đấu  
- **Personnel Summary** - Tóm tắt nhân sự

## 🛠️ Technical Implementation

### Backend (C# .NET)
```
Controllers/AnalyticsController.cs       - API endpoints
Services/AnalyticsService.cs            - Business logic
DTOs/Analytics/AnalyticsDtos.cs         - Data transfer objects
```

### API Endpoints
```
GET /api/analytics/dashboard            - Complete dashboard data
GET /api/analytics/financial           - Financial statistics
GET /api/analytics/matches             - Match statistics  
GET /api/analytics/personnel           - Personnel statistics
GET /api/analytics/trends              - Monthly trends
GET /api/analytics/top-stadiums        - Top stadiums
GET /api/analytics/top-teams           - Top teams
GET /api/analytics/status-distribution - Status pie chart data
GET /api/analytics/revenue-profit-trend - Revenue vs profit trend
GET /api/analytics/match-type-distribution - Match type pie chart
GET /api/analytics/cancelled-analysis   - Cancellation analysis
GET /api/analytics/photographer-cameraman-analysis - Personnel analysis
```

### Frontend (React + TypeScript)
```
services/analyticsService.ts           - API integration
components/analytics/                  - Chart components
  ├── AnalyticsFilter.tsx             - Filter component
  ├── AnalyticsStats.tsx              - Stats cards
  ├── FinancialTrendChart.tsx         - Line chart (Highcharts)
  ├── StatusPieChart.tsx              - Pie chart (Highcharts)
  ├── RevenueBarChart.tsx             - Bar chart (Highcharts)
  ├── PersonnelCostChart.tsx          - Column chart (Highcharts)
  ├── MatchTypeChart.tsx              - Pie chart (Highcharts)
  ├── TopStadiums.tsx                 - Stadium ranking
  └── TopTeams.tsx                    - Team ranking
app/(dashboard)/analytics/page.tsx     - Main analytics page
```

### Charts Library
- **Highcharts** - Professional charting library
- **highcharts-react-official** - React wrapper

## 📊 Chart Types Used

1. **Line Chart** - Revenue vs Profit trend over time
2. **Column/Bar Chart** - Monthly revenue, personnel costs
3. **Pie Chart** - Status distribution, match type distribution  
4. **Stacked Column** - Personnel costs breakdown
5. **Data Tables** - Top stadiums and teams

## 🎨 Design Features

- **Responsive Design** - Works on all screen sizes
- **Dark/Light Mode** - Follows system theme
- **Interactive Charts** - Hover effects, tooltips
- **Real-time Data** - Refreshable dashboard
- **Filter System** - Advanced filtering options
- **Loading States** - Smooth UX during data fetch
- **Error Handling** - Graceful error states

## 🚀 How to Use

1. **Navigate** to `/analytics` in the dashboard
2. **Set Filters** (optional) - Choose date range, stadium, team, etc.
3. **View Metrics** - Check key metrics cards at the top
4. **Analyze Charts** - Hover over charts for detailed data
5. **Check Rankings** - See top performers in stadiums and teams
6. **Refresh Data** - Click refresh for latest data
7. **Export** (coming soon) - Download reports

## 🔧 Configuration

### Environment Variables (Backend)
```
DATABASE_URL=postgresql://...          # Database connection
JwtSettings__AccessTokenSecret=...     # JWT secret
```

### Dependencies (Frontend)
```json
{
  "highcharts": "^11.2.0",
  "highcharts-react-official": "^3.2.1"
}
```

## 📈 Sample Data Visualization

The dashboard displays data in following format:

**Financial Stats:**
- Revenue: ₫50,000,000
- Cost: ₫35,000,000  
- Profit: ₫15,000,000 (30% margin)

**Match Stats:**
- Total: 100 matches
- Completed: 85 (85%)
- Pending: 10 (10%)
- Cancelled: 5 (5%)

**Personnel Stats:**
- Photographer: ₫10,000,000 (80% participation)
- Cameraman: ₫8,000,000 (75% participation)

## 🎯 Future Enhancements

- [ ] **Export to PDF/Excel** - Download reports
- [ ] **Real-time Updates** - WebSocket integration
- [ ] **Predictive Analytics** - AI-powered forecasting
- [ ] **Custom Dashboards** - User-defined layouts
- [ ] **Email Reports** - Scheduled reports
- [ ] **Mobile App** - Native mobile version
- [ ] **Advanced Filters** - More granular filtering
- [ ] **Data Comparison** - Year-over-year comparison

## 🏆 Benefits

✅ **Data-Driven Decisions** - Make informed business decisions
✅ **Performance Tracking** - Monitor KPIs and trends  
✅ **Cost Optimization** - Identify cost-saving opportunities
✅ **Revenue Growth** - Understand revenue patterns
✅ **Operational Insights** - Improve operational efficiency
✅ **Visual Appeal** - Professional, modern interface
✅ **Real-time Monitoring** - Stay updated with latest data
