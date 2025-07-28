'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { authService } from '@/services/authService';
import { isTokenExpired } from '@/services/api';

export function TokenDebugPanel() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateTokenInfo = () => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();
    
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - currentTime;
        const isExpired = isTokenExpired(accessToken);
        
        setTokenInfo({
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          isAuthenticated,
          userEmail: user?.email || 'N/A',
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
          timeUntilExpiry: timeUntilExpiry,
          isExpiredOrSoon: isExpired,
          currentTime: new Date().toLocaleString(),
          tokenLength: accessToken.length,
          refreshTokenLength: refreshToken?.length || 0,
        });
      } catch (error) {
        setTokenInfo({
          error: 'Failed to parse token',
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          isAuthenticated,
        });
      }
    } else {
      setTokenInfo({
        hasAccessToken: false,
        hasRefreshToken: !!refreshToken,
        isAuthenticated,
        userEmail: 'No user',
      });
    }
  };

  useEffect(() => {
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000); // Update every second
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
      >
        🔧 Token Debug {tokenInfo?.isExpiredOrSoon ? '⚠️' : '✅'}
      </button>
      
      {isVisible && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg max-w-xs text-xs">
          <div className="space-y-1">
            <div className="font-bold text-blue-600 dark:text-blue-400">Token Status</div>
            
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>Authenticated:</span>
              <span className={tokenInfo?.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {tokenInfo?.isAuthenticated ? '✅' : '❌'}
              </span>
              
              <span>Has Access Token:</span>
              <span className={tokenInfo?.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
                {tokenInfo?.hasAccessToken ? '✅' : '❌'}
              </span>
              
              <span>Has Refresh Token:</span>
              <span className={tokenInfo?.hasRefreshToken ? 'text-green-600' : 'text-red-600'}>
                {tokenInfo?.hasRefreshToken ? '✅' : '❌'}
              </span>
              
              {tokenInfo?.timeUntilExpiry && (
                <>
                  <span>Expires In:</span>
                  <span className={tokenInfo.timeUntilExpiry < 60 ? 'text-red-600' : 'text-green-600'}>
                    {tokenInfo.timeUntilExpiry}s
                  </span>
                </>
              )}
              
              <span>User:</span>
              <span className="truncate">{tokenInfo?.userEmail || 'N/A'}</span>
              
              {tokenInfo?.expiresAt && (
                <>
                  <span className="col-span-2 text-gray-500 mt-1">
                    Expires: {tokenInfo.expiresAt}
                  </span>
                </>
              )}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  if ((window as any).tokenRefreshDebug) {
                    (window as any).tokenRefreshDebug.forceRefresh();
                  }
                }}
                className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 w-full"
              >
                🔄 Force Refresh
              </button>
            </div>
            
            <div className="mt-1">
              <button
                onClick={() => {
                  if ((window as any).tokenRefreshDebug) {
                    (window as any).tokenRefreshDebug.getCurrentTokenInfo();
                  }
                }}
                className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 w-full"
              >
                📋 Log Token Info
              </button>
            </div>
            
            {tokenInfo?.error && (
              <div className="text-red-600 text-xs mt-1">
                Error: {tokenInfo.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
