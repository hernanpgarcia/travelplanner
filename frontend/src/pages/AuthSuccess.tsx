import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function AuthSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const session = searchParams.get('session')
    const error = searchParams.get('error')

    if (error) {
      console.error('Auth error:', error)
      navigate('/')
      return
    }

    if (session) {
      try {
        // Decode session data
        const sessionData = JSON.parse(decodeURIComponent(session))
        
        // Store auth data
        localStorage.setItem('auth_token', sessionData.token)
        localStorage.setItem('auth_user', JSON.stringify(sessionData.user))
        
        console.log('Auth successful, redirecting to dashboard...')
        
        // Redirect to dashboard
        navigate('/dashboard')
      } catch (e) {
        console.error('Failed to process session:', e)
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [searchParams, navigate])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Authentication Successful</h2>
      <p>Redirecting to dashboard...</p>
    </div>
  )
}