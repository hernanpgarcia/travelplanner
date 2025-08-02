/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to the landing page.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequireAuth } from '../hooks/useAuth'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, shouldRedirect } = useRequireAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/')
    }
  }, [shouldRedirect, navigate])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-600" />
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user should be redirected
  if (shouldRedirect) {
    return null
  }

  // Render protected content for authenticated users
  return <>{children}</>
}