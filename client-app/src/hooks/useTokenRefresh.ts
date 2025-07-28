'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, setUser } from '@/store/authSlice';
import { authService } from '@/services/authService';
import { tokenManager } from '@/services/tokenManager';
import { isTokenExpired } from '@/services/api';

export function useTokenRefresh() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);
  const redirectedRef = useRef<boolean>(false); // Prevent multiple redirects

  const checkAndRefreshToken = async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingRef.current || !tokenManager.canRefresh()) {
      return;
    }

    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (!accessToken || !refreshToken) {
      dispatch(logout());
      return;
    }

    // Check if access token is expired or about to expire (within 30 seconds)
    if (isTokenExpired(accessToken)) {
      try {
        isRefreshingRef.current = true;
        
        const newAccessToken = await tokenManager.refreshToken();
        
        // Get updated user from authService after refresh
        const user = authService.getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
        
        // Silent refresh - no notifications, no redirects
        
      } catch (error) {
        // Only logout on actual refresh failure - no notifications
        dispatch(logout());
        
        // Prevent multiple redirects
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          
          // Soft redirect using Next.js router (no page refresh)
          try {
            router.push('/login');
          } catch (routerError) {
            // Fallback to hard redirect only if router fails
            console.warn('Router redirect failed, using fallback:', routerError);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
      } finally {
        isRefreshingRef.current = false;
      }
    }
  };

  const startTokenRefreshInterval = () => {
    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Check token every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      checkAndRefreshToken();
    }, 30 * 1000);
  };

  const stopTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    isRefreshingRef.current = false;
    redirectedRef.current = false; // Reset redirect flag when stopping
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Initial check
      checkAndRefreshToken();
      // DISABLED: Start interval to prevent excessive calls
      // startTokenRefreshInterval();
    } else {
      stopTokenRefreshInterval();
    }

    return () => {
      stopTokenRefreshInterval();
    };
  }, [isAuthenticated]);

  // Handle page visibility change to refresh token when user comes back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !isRefreshingRef.current) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Handle focus events to refresh token when user comes back to tab
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && !isRefreshingRef.current) {
        checkAndRefreshToken();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  return {
    checkAndRefreshToken,
    startTokenRefreshInterval,
    stopTokenRefreshInterval,
  };
}
