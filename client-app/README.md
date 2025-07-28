# Base - SaaS Dashboard

A modern, fully responsive SaaS dashboard built with Next.js, TypeScript, SASS, and shadcn/ui components.

## ✨ Features

- 🎨 Modern UI with shadcn/ui components
- 📱 **Fully responsive design** - Mobile, tablet, and desktop optimized
- 🌙 Dark/Light mode support
- 📊 Interactive charts with Highcharts
- ⚽ Football matches management
- 📅 Calendar with event creation
- 📈 Analytics dashboard
- 🔐 Authentication pages (Login/Signup)
- 🎯 Reusable components
- 📋 Form validation with react-hook-form
- 🚀 **Mobile-first responsive approach**

## 📱 Responsive Design Features

### Mobile Optimizations
- **Collapsible sidebar** with overlay for mobile
- **Mobile-friendly navigation** with hamburger menu
- **Responsive cards and tables** with mobile-specific layouts
- **Touch-optimized buttons** (44px minimum touch targets)
- **Adaptive typography** and spacing
- **Mobile-specific calendar view** with condensed events
- **Card-based layouts** for mobile tables

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Component Responsiveness
- **Header**: Mobile menu button, adaptive search, collapsible elements
- **Sidebar**: Slide-in mobile navigation with backdrop
- **Cards**: Responsive grid layouts (1-2-3-4 columns)
- **Charts**: Auto-sizing with mobile-optimized heights
- **Tables**: Card layout on mobile, scrollable on larger screens
- **Forms**: Full-width inputs on mobile, proper sizing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: SASS + Tailwind CSS (Mobile-first)
- **UI Components**: shadcn/ui
- **Charts**: Highcharts (Responsive)
- **Forms**: React Hook Form with Controller
- **Icons**: Lucide React
- **Theme**: next-themes
- **Responsive**: Mobile-first CSS approach

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/caovu/Work/ManagementApp/client-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page
│   ├── calendar/          # Calendar page
│   ├── football-matches/  # Football matches management
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard home page
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── calendar/         # Calendar components
│   ├── football/         # Football match components
│   ├── ui/               # shadcn/ui base components
│   ├── app-layout.tsx    # Main app layout
│   ├── header.tsx        # Header component
│   └── sidebar.tsx       # Sidebar navigation
├── lib/                  # Utility functions
│   └── utils.ts          # Tailwind utils
└── styles/               # SASS styles
    ├── globals.scss      # Global styles
    └── _variables.scss   # SASS variables
```

## Key Features

### Dashboard
- Overview analytics cards
- Interactive charts (line, area, pie, donut)
- Recent orders and top products tables
- Revenue and visitor tracking

### Football Matches Management
- CRUD operations for football matches
- Modal-based forms using react-hook-form
- Status tracking (ĐÃ THU, PENDING, LOST)
- Financial data management

### Calendar
- Monthly calendar view
- Event creation with modal
- Event type categorization
- Color-coded events

### Analytics
- Page views and user activity tracking
- Device usage statistics
- Traffic source analysis
- Conversion rate monitoring

### Authentication
- Login/Signup pages with validation
- Social login options (Google, Facebook)
- Password requirements
- Terms and conditions acceptance

## Components

### Reusable UI Components
- `AnalysisCard`: Metric display cards with trends
- `ChartCard`: Configurable chart wrapper for Highcharts
- `Table`: Data table with sorting and pagination
- `Modal`: Form modals with react-hook-form integration

### Form Validation
All forms use react-hook-form with Controller for:
- Type-safe form data
- Real-time validation
- Error handling
- Controlled components

## Styling

- **SASS**: Used for component-specific styles and variables
- **Tailwind CSS**: Utility classes for rapid development
- **CSS Variables**: Dynamic theming support
- **Dark Mode**: Automatic theme switching

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Color Scheme

The dashboard uses a modern color palette:
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.
