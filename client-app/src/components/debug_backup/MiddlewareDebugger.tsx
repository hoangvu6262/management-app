'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import { isTokenExpired } from '@/services/api';

export function MiddlewareDebugger() {
  const router = useRouter();
  const pathname = usePathname();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const checkMiddlewareLogic = () => {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();
      
      const hasValidToken = accessToken && !isTokenExpired(accessToken);
      const hasRefreshToken = !!refreshToken;
      const isAuthenticated = hasValidToken || hasRefreshToken;
      
      const publicRoutes = ['/login', '/signup'];
      const protectedRoutes = ['/', '/football-matches', '/calendar', '/analytics', '/projects', '/schedule'];
      
      const isPublicRoute = publicRoutes.includes(pathname);
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      const info = {
        currentPath: pathname,
        hasAccessToken: !!accessToken,
        hasRefreshToken,
        hasValidToken,
        tokenExpired: accessToken ? isTokenExpired(accessToken) : 'no token',
        isAuthenticated,
        isPublicRoute,
        isProtectedRoute,
        middlewareWouldRedirect: {
          toHome: isAuthenticated && isPublicRoute,
          toLogin: !isAuthenticated && isProtectedRoute,
        },
        timestamp: new Date().toLocaleTimeString()
      };

      setDebugInfo(info);
      
      // Log important redirects
      if (info.middlewareWouldRedirect.toHome) {
        console.warn(`🔧 [MiddlewareDebugger] ⚠️ MIDDLEWARE WOULD REDIRECT: ${pathname} → / (authenticated user on public route)`);
      }
      if (info.middlewareWouldRedirect.toLogin) {
        console.warn(`🔧 [MiddlewareDebugger] ⚠️ MIDDLEWARE WOULD REDIRECT: ${pathname} → /login (unauthenticated user on protected route)`);
      }
    };

    checkMiddlewareLogic();
    
    // Check every 5 seconds
    const interval = setInterval(checkMiddlewareLogic, 5000);
    
    return () => clearInterval(interval);
  }, [pathname]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!debugInfo) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 shadow-lg text-xs">
        <div className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
          🔧 Middleware Debug
        </div>
        
        <div className="space-y-1 text-yellow-700 dark:text-yellow-300">
          <div><strong>Path:</strong> {debugInfo.currentPath}</div>
          <div><strong>Access Token:</strong> {debugInfo.hasAccessToken ? '✅' : '❌'}</div>
          <div><strong>Valid Token:</strong> {debugInfo.hasValidToken ? '✅' : '❌'}</div>
          <div><strong>Refresh Token:</strong> {debugInfo.hasRefreshToken ? '✅' : '❌'}</div>
          <div><strong>Authenticated:</strong> {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
          <div><strong>Public Route:</strong> {debugInfo.isPublicRoute ? '✅' : '❌'}</div>
          <div><strong>Protected Route:</strong> {debugInfo.isProtectedRoute ? '✅' : '❌'}</div>
          
          {debugInfo.middlewareWouldRedirect.toHome && (
            <div className="text-red-600 dark:text-red-400 font-bold">
              ⚠️ Would redirect to /
            </div>
          )}
          
          {debugInfo.middlewareWouldRedirect.toLogin && (
            <div className="text-red-600 dark:text-red-400 font-bold">
              ⚠️ Would redirect to /login
            </div>
          )}
          
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            Last check: {debugInfo.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
