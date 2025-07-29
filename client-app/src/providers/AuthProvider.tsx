"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { setUser, setLoading } from "@/store/authSlice";
import { authService } from "@/services/authService";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize token refresh mechanism
  useTokenRefresh();

  useEffect(() => {
    // Initialize auth state from cookies synchronously
    const initializeAuth = () => {
      dispatch(setLoading(true));

      try {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (user && isAuthenticated) {
          dispatch(setUser(user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
