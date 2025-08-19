"use client";

import "@/styles/profile-mobile.css";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { NotificationToast } from "@/components/notifications/NotificationToast";
import { Toaster } from "sonner";
// import { DebugAuth } from "@/components/debug/DebugAuth";
// import { TokenExpiryTest } from "@/components/debug/TokenExpiryTest";
// import { SimpleApiTest } from "@/components/debug/SimpleApiTest";
// import { TokenRefreshTest } from '@/components/debug/TokenRefreshTest'
// import { ApiTest } from '@/components/debug/ApiTest'
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { authService } from "@/services/authService";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Handle logout functionality
    const handleLogout = async () => {
      try {
        await authService.logout();
        dispatch(logout());
        router.push("/login");
      } catch (error) {
        dispatch(logout());
        router.push("/login");
      }
    };

    // Handle logout without redirect (for token refresh failures)
    const handleLogoutWithoutRedirect = () => {
      dispatch(logout());
    };

    // Expose functions globally for components and API interceptors
    (window as any).handleLogout = handleLogout;
    (window as any).dispatchLogout = handleLogoutWithoutRedirect;
  }, [dispatch, router]);

  // Redirect to login if not authenticated after loading is complete
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Check actual cookies instead of just Redux state
    const hasValidAuth = () => {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      // User is considered authenticated if they have either valid access token OR refresh token
      return !!(accessToken || refreshToken);
    };

    if (!isLoading && (!isAuthenticated || !hasValidAuth())) {
      timeoutId = setTimeout(() => {
        router.replace("/login");
      }, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner during auth initialization
  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header
            title="Dashboard"
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
          <main className="flex-1 overflow-hidden p-2 sm:p-4 lg:p-6">
            <div className="h-full overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </main>
        </div>

        {/* Notifications */}
        <NotificationToast />
        <Toaster position="top-right" richColors />

        {/* Debug info */}
        {/* <DebugAuth />
        <TokenExpiryTest />
        <SimpleApiTest /> */}
      </div>
    </ThemeProvider>
  );
}
