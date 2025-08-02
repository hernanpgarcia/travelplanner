import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { CheckCircle, XCircle } from 'lucide-react'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const errorParam = searchParams.get('error')

        console.log('🔵 AuthCallback started with:', { code: code?.substring(0, 10), state, errorParam })

        // Handle OAuth error
        if (errorParam) {
          console.error('🔴 OAuth error:', errorParam)
          setError(`OAuth error: ${errorParam}`)
          setIsProcessing(false)
          setTimeout(() => navigate('/'), 3000)
          return
        }

        // Handle missing code
        if (!code) {
          console.error('🔴 No authorization code received')
          setError('No authorization code received')
          setIsProcessing(false)
          setTimeout(() => navigate('/'), 3000)
          return
        }

        console.log('🔵 Making API call to backend...')
        
        // Direct API call to backend
        const response = await fetch('http://localhost:8000/api/v1/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state: state || undefined }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('🔴 Backend error:', errorText)
          setError(`Authentication failed: ${errorText}`)
          setIsProcessing(false)
          setTimeout(() => navigate('/'), 3000)
          return
        }

        const authData = await response.json()
        console.log('🟢 Auth successful:', authData.user?.email)

        // Store auth data
        localStorage.setItem('auth_token', authData.access_token)
        localStorage.setItem('auth_user', JSON.stringify(authData.user))

        setSuccess(true)
        setIsProcessing(false)
        setTimeout(() => navigate('/dashboard'), 2000)
        
      } catch (err) {
        console.error('🔴 Callback processing failed:', err)
        setError(`Processing failed: ${err instanceof Error ? err.message : String(err)}`)
        setIsProcessing(false)
        setTimeout(() => navigate('/'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-secondary-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-secondary-500">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Welcome!
          </h2>
          <p className="text-secondary-600 mb-4">
            You have been successfully signed in.
          </p>
          <p className="text-sm text-secondary-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  // Show loading state
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