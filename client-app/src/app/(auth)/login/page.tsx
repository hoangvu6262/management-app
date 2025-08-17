'use client'

import { LoginForm } from '@/components/auth/login-form'
import { useAppSelector } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // If authenticated, don't render login form
  if (isAuthenticated) {
    return <div>Redirecting...</div>
  }

  return <LoginForm />
}
