import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'

export function AuthCallback() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // TODO: Handle OAuth callback
    // For now, just redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [navigate])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-600" />
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Signing you in...
        </h2>
        <p className="text-secondary-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  )
}