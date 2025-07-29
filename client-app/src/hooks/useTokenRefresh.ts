"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, setUser } from "@/store/authSlice";
import { authService } from "@/services/authService";
import { tokenManager } from "@/services/tokenManager";
import { isTokenExpired } from "@/services/api";

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

    if (!refreshToken) {
      dispatch(logout());
      return;
    }

    // If no access token, try to refresh
    if (!accessToken) {
      try {
        isRefreshingRef.current = true;
        await tokenManager.refreshToken();

        // Update Redux state with fresh user data
        const user = authService.getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        dispatch(logout());

        if (!redirectedRef.current) {
          redirectedRef.current = true;
          router.push("/login");
        }
      } finally {
        isRefreshingRef.current = false;
      }
      return;
    }

    // Check if access token is expired or about to expire
    if (isTokenExpired(accessToken)) {
      try {
        isRefreshingRef.current = true;
        await tokenManager.refreshToken();

        // Update Redux state
        const user = authService.getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        dispatch(logout());

        if (!redirectedRef.current) {
          redirectedRef.current = true;
          router.push("/login");
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

    // Check token every 60 seconds (reduced frequency)
    refreshIntervalRef.current = setInterval(() => {
      checkAndRefreshToken();
    }, 60 * 1000);
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

      // Start interval for automatic token checking
      startTokenRefreshInterval();
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
      if (
        document.visibilityState === "visible" &&
        isAuthenticated &&
        !isRefreshingRef.current
      ) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Handle focus events to refresh token when user comes back to tab
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && !isRefreshingRef.current) {
        checkAndRefreshToken();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  return {
    checkAndRefreshToken,
    startTokenRefreshInterval,
    stopTokenRefreshInterval,
  };
}
