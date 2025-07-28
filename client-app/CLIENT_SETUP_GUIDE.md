# Client App Configuration Guide

## 📋 **Overview**
Đã cấu hình hoàn chỉnh client-app với authentication, API integration, state management và UI components.

## 🔧 **Environment Variables**

### Files Created:
- `.env` - Base environment
- `.env.local` - Local development  
- `.env.development` - Development environment
- `.env.production` - Production environment

### Configuration:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_ENV=development
```

## 🔗 **API Integration**

### Axios Configuration (`src/services/api.ts`)
- **Base URL**: Từ environment variables
- **Timeout**: 10 seconds
- **Auto token attachment**: Lấy từ cookies
- **Auto refresh token**: Khi token hết hạn
- **Error handling**: Redirect to login khi unauthorized

### Services Created:
1. **Auth Service** (`src/services/authService.ts`)
   - Login, Register, Change Password
   - Refresh Token, Logout
   - Cookie management (httpOnly)

2. **Football Match Service** (`src/services/footballMatchService.ts`)
   - CRUD operations
   - Filtering & Pagination
   - Profit calculation
   - Currency formatting

3. **Calendar Event Service** (`src/services/calendarEventService.ts`)
   - CRUD operations  
   - Time format conversion
   - Type color management

## 📊 **SWR Configuration**

### Global Settings (`src/providers/Providers.tsx`):
- No auto refresh
- Revalidate on reconnect
- Error retry: 3 times
- Retry interval: 5 seconds

### Custom Hooks:
1. **useFootballMatches** (`src/hooks/useFootballMatches.ts`)
   - Auto pagination & filtering
   - Global mutation support
   - Create/Update/Delete mutations

2. **useCalendarEvents** (`src/hooks/useCalendarEvents.ts`)
   - Calendar view optimization
   - Event mutations
   - Real-time updates

## 🏪 **Redux Store**

### Store Structure (`src/store/`):
1. **authSlice.ts**: User authentication state
2. **uiSlice.ts**: UI state (sidebar, theme, notifications)
3. **index.ts**: Store configuration & typed hooks

### Usage:
```typescript
const { user, isAuthenticated } = useAppSelector(state => state.auth)
const dispatch = useAppDispatch()
```

## 🛡️ **Authentication & Route Protection**

### Middleware (`src/middleware.ts`):
- **Public routes**: `/login`, `/signup`
- **Protected routes**: All others
- **Token validation**: Check accessToken cookie
- **Redirect logic**: Save intended destination

### Features:
- Auto login redirect after authentication
- Protect routes from unauthenticated access
- Redirect authenticated users away from login page

### Cookie Management:
- **accessToken**: Expires với token (5 phút)
- **refreshToken**: Expires sau 7 ngày  
- **user**: User info JSON
- **httpOnly**: false (để client-side access)
- **secure**: true trong production
- **sameSite**: 'lax'

## ⚽ **Football Matches Management**

### Features Implemented:
1. **Table View**: Desktop & Mobile responsive
2. **Filtering**: Date range, stadium, status
3. **Pagination**: Configurable page size
4. **Sorting**: Multiple columns, newest first default
5. **CRUD Operations**: Create, Update, Delete (soft)
6. **Status Management**: Dropdown with inline editing
7. **Profit Calculation**: Auto-calculated from revenue/costs
8. **Currency Formatting**: Vietnamese locale

### Modal Features:
- **Add Mode**: Create new matches
- **Edit Mode**: Update existing matches  
- **Form Validation**: Required fields, number validation
- **Financial Fields**: Revenue, costs, photographer, cameraman, discount

### API Integration:
- **SWR**: Auto-refresh on mutations
- **Optimistic Updates**: UI updates before API response
- **Error Handling**: User-friendly error messages

## 📅 **Calendar Management**

### Features Implemented:
1. **Calendar View**: Month view with navigation
2. **Event Display**: Color-coded by type
3. **Event Creation**: Click date to create
4. **Event Editing**: Click event to edit
5. **Event Deletion**: Delete button in edit modal
6. **Responsive Design**: Mobile & desktop optimized

### Event Types:
- **Meeting**: Blue color
- **Task**: Orange color  
- **Reminder**: Red color
- **Other**: Purple color

### API Integration:
- **Real-time updates**: SWR mutations
- **Time conversion**: Handle backend TimeSpan format
- **Color management**: Type-based auto coloring

## 🎨 **UI Components**

### Enhanced Components:
1. **Header**: User menu, logout, search, theme toggle
2. **AppLayout**: Auth-aware layout with loading states
3. **Login Form**: API integration, error handling
4. **Providers**: Redux + SWR + Auth providers

### New Components:
1. **DropdownMenu**: User menu implementation
2. **Enhanced Modals**: Add/Edit support
3. **Loading States**: Spinner components
4. **Error Handling**: Try again buttons

## 🔄 **State Management Flow**

### Authentication Flow:
1. **Login**: API call → Store tokens in cookies → Update Redux
2. **Auto-refresh**: Axios interceptor → Refresh token → Update cookies
3. **Logout**: Clear cookies → Update Redux → Redirect

### Data Flow:
1. **SWR**: Fetch data → Cache → Auto-revalidate
2. **Mutations**: API call → Mutate SWR cache → UI update
3. **Error**: Display error → Retry option

## 🚀 **How to Run**

### 1. Start Server:
```bash
cd server-app
dotnet run
```

### 2. Start Client:
```bash
cd client-app
npm run dev
```

### 3. Access Application:
- **Client**: http://localhost:3000
- **Server**: http://localhost:5000
- **API Docs**: http://localhost:5000 (Swagger)

### 4. Demo Login:
- **Email**: admin@managementapp.com
- **Password**: admin123

## ✅ **Completed Features**

### ✅ Environment Configuration
- [x] Multiple environment files
- [x] API URL configuration

### ✅ API Integration  
- [x] Axios setup with interceptors
- [x] Auto token refresh
- [x] Service separation (Auth, Football, Calendar)

### ✅ SWR Configuration
- [x] Global SWR settings
- [x] Custom hooks for data fetching
- [x] Mutation handling

### ✅ Redux Store
- [x] Auth state management
- [x] UI state management  
- [x] Typed hooks

### ✅ Authentication
- [x] Login/logout functionality
- [x] Cookie-based token storage
- [x] Route protection middleware
- [x] Auto-redirect logic

### ✅ Football Management
- [x] Table with filtering & pagination
- [x] CRUD operations via API
- [x] Profit calculations
- [x] Responsive design
- [x] SWR integration

### ✅ Calendar Management
- [x] Calendar view with events
- [x] CRUD operations via API
- [x] Color-coded event types
- [x] SWR integration

## 🔧 **Next Steps**

1. **Error Handling**: Implement toast notifications
2. **Performance**: Add loading skeletons
3. **Testing**: Add unit tests
4. **Caching**: Optimize SWR cache strategies
5. **Validation**: Add client-side validation schemas
6. **Accessibility**: Improve ARIA labels and keyboard navigation

## 📝 **Notes**

- Tất cả API calls đều thông qua services
- SWR tự động handle caching và revalidation
- Redux chỉ dùng cho global state (auth, UI)
- Cookie httpOnly = false để client access (cân nhắc security)
- Auto-refresh token trước khi expire
- Soft delete cho Football matches và Calendar events
- Responsive design cho mobile và desktop
