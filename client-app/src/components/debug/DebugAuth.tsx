'use client'

import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { useAppSelector } from '@/store'
import { isTokenExpired } from '@/services/api'

export function DebugAuth() {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)
  const [tokenInfo, setTokenInfo] = useState<any>({})
  
  useEffect(() => {
    const updateTokenInfo = () => {
      const accessToken = authService.getAccessToken()
      const refreshToken = authService.getRefreshToken()
      
      let tokenExpiry = null
      let timeUntilExpiry = null
      
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          tokenExpiry = new Date(payload.exp * 1000)
          timeUntilExpiry = Math.floor((payload.exp * 1000 - Date.now()) / 1000)
        } catch (e) {
          // Invalid token
        }
      }
      
      setTokenInfo({
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        tokenExpiry,
        timeUntilExpiry,
        isExpiring: accessToken ? isTokenExpired(accessToken) : false
      })
    }
    
    updateTokenInfo()
    const interval = setInterval(updateTokenInfo, 1000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, isLoading, user])
  
  return (
    <div className="fixed top-0 right-0 bg-black text-white p-4 text-xs z-50 max-w-xs">
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
        <div>User: {user ? user.fullName : 'null'}</div>
        <div>Access Token: {tokenInfo.hasAccessToken ? '✅' : '❌'}</div>
        <div>Refresh Token: {tokenInfo.hasRefreshToken ? '✅' : '❌'}</div>
        {tokenInfo.timeUntilExpiry !== null && (
          <div className={tokenInfo.isExpiring ? 'text-red-400' : 'text-green-400'}>
            Expires in: {tokenInfo.timeUntilExpiry > 0 ? `${tokenInfo.timeUntilExpiry}s` : 'EXPIRED'}
          </div>
        )}
        {tokenInfo.tokenExpiry && (
          <div className="text-gray-300">
            Expires: {tokenInfo.tokenExpiry.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
