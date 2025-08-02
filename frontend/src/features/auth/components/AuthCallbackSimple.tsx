import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function AuthCallbackSimple() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return
    
    const processAuth = async () => {
      const code = searchParams.get('code')
      
      // Check if already authenticated
      const existingToken = localStorage.getItem('auth_token')
      if (existingToken) {
        console.log('Already authenticated, redirecting to dashboard')
        navigate('/dashboard')
        return
      }
      
      if (!code) {
        console.error('No code in URL')
        navigate('/')
        return
      }

      hasProcessed.current = true
      
      try {
        console.log('Processing auth code...')
        // Simple fetch to backend
        const response = await fetch('http://localhost:8000/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Auth successful:', data.user.email)
          localStorage.setItem('auth_token', data.access_token)
          localStorage.setItem('auth_user', JSON.stringify(data.user))
          
          // Force navigation to dashboard
          window.location.href = '/dashboard'
        } else {
          const errorText = await response.text()
          console.error('Auth failed:', errorText)
          navigate('/')
        }
      } catch (error) {
        console.error('Error:', error)
        navigate('/')
      }
    }

    processAuth()
  }, [searchParams, navigate])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processing login...</h2>
      <p>Please wait...</p>
    </div>
  )
}