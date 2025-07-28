'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setUser, setLoading } from '@/store/authSlice';
import { authService } from '@/services/authService';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  
  // Initialize token refresh mechanism
  useTokenRefresh();

  useEffect(() => {
    // Initialize auth state from cookies
    const initializeAuth = async () => {
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
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
}
