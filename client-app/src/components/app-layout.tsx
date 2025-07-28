'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { NotificationToast } from '@/components/notifications/NotificationToast'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { authService } from '@/services/authService'

const authRoutes = ['/login', '/signup']

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)
  const isAuthRoute = authRoutes.includes(pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Handle logout functionality
    const handleLogout = async () => {
      try {
        await authService.logout()
        dispatch(logout())
        router.push('/login')
      } catch (error) {
        dispatch(logout())
        router.push('/login')
      }
    }

    // Handle logout without redirect (for token refresh failures)
    const handleLogoutWithoutRedirect = () => {
      dispatch(logout())
    }

    // Expose functions globally for components and API interceptors
    (window as any).handleLogout = handleLogout;
    (window as any).dispatchLogout = handleLogoutWithoutRedirect;
  }, [dispatch, router])

  // Show loading spinner during auth initialization
  if (isLoading && !isAuthRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    )
  }

  // Auth routes (login, signup)
  if (isAuthRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <NotificationToast />
      </ThemeProvider>
    )
  }

  // Protected routes
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Dashboard" 
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
          <main className="flex-1 overflow-hidden p-4 lg:p-6">
            <div className="h-full overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </main>
        </div>
        
        {/* Notifications */}
        <NotificationToast />
      </div>
    </ThemeProvider>
  )
}
