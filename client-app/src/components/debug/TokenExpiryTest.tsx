'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/authService'
import { tokenManager } from '@/services/tokenManager'
import { isTokenExpired } from '@/services/api'
import { useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import Cookies from 'js-cookie'

export function TokenExpiryTest() {
  const [status, setStatus] = useState('')
  const dispatch = useAppDispatch()

  const simulateTokenExpiry = () => {
    console.log('⏰ Simulating token expiry...')
    
    // Create an expired token (expires 1 second ago)
    const expiredPayload = {
      exp: Math.floor(Date.now() / 1000) - 1, // 1 second ago
      sub: 'test-user',
      iat: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    }
    
    // Create a fake expired token (this will not work with real backend, just for UI testing)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify(expiredPayload))
    const signature = 'fake-signature'
    const expiredToken = `${header}.${payload}.${signature}`
    
    // Set expired token
    Cookies.set('accessToken', expiredToken, {
      expires: new Date(Date.now() - 1000), // Already expired
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    setStatus('✅ Expired token set')
    console.log('Token is expired:', isTokenExpired(expiredToken))
  }

  const testRefreshFlow = async () => {
    setStatus('🔄 Testing refresh flow...')
    
    try {
      console.log('=== TESTING REFRESH FLOW ===')
      console.log('Current tokens:')
      console.log('- Access:', !!authService.getAccessToken())
      console.log('- Refresh:', !!authService.getRefreshToken())
      
      const accessToken = authService.getAccessToken()
      if (accessToken) {
        console.log('- Access token expired:', isTokenExpired(accessToken))
      }
      
      // Trigger refresh
      if (tokenManager.canRefresh()) {
        const newToken = await tokenManager.refreshToken()
        setStatus('✅ Refresh successful')
        console.log('New token received:', !!newToken)
      } else {
        setStatus('❌ Cannot refresh (cooldown or already refreshing)')
      }
    } catch (error: any) {
      setStatus(`❌ Refresh failed: ${error.message}`)
      console.error('Refresh test failed:', error)
    }
  }

  const clearTokens = () => {
    console.log('🧹 Clearing all tokens')
    authService.clearAuthData()
    dispatch(logout())
    setStatus('🧹 Tokens cleared, should redirect to login')
  }

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-sm">Token Expiry Test</h3>
      <div className="space-y-2">
        <Button 
          onClick={simulateTokenExpiry}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Set Expired Token
        </Button>
        <Button 
          onClick={testRefreshFlow}
          size="sm"
          className="w-full text-xs"
        >
          Test Refresh
        </Button>
        <Button 
          onClick={clearTokens}
          variant="destructive"
          size="sm"
          className="w-full text-xs"
        >
          Clear Tokens
        </Button>
      </div>
      {status && (
        <div className="mt-2 text-xs break-words">
          {status}
        </div>
      )}
    </div>
  )
}
