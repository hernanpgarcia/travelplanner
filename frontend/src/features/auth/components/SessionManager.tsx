/**
 * SessionManager Component
 * 
 * Manages authentication session lifecycle, token refresh, and session expiry.
 */

import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

interface SessionManagerProps {
  children: React.ReactNode
  sessionWarningMinutes?: number
  sessionTimeoutMinutes?: number
}

export function SessionManager({ 
  children, 
  sessionWarningMinutes = 5,
  sessionTimeoutMinutes = 30
}: SessionManagerProps) {
  const navigate = useNavigate()
  const { isAuthenticated, refreshUser, logout } = useAuth()
  const warningTimerRef = useRef<NodeJS.Timeout>()
  const timeoutTimerRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  // Handle session warning
  const handleSessionWarning = useCallback(() => {
    if (!isAuthenticated) return
    
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Session Expiring Soon</p>
        <p className="text-sm text-secondary-600">
          Your session will expire in {sessionWarningMinutes} minutes.
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              refreshUser()
              toast.dismiss(t.id)
              toast.success('Session extended')
            }}
            className="btn btn-primary btn-sm"
          >
            Extend Session
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-ghost btn-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    ), {
      duration: 60000, // Show for 1 minute
      position: 'top-center',
    })
  }, [isAuthenticated, refreshUser, sessionWarningMinutes])

  // Handle session timeout
  const handleSessionTimeout = useCallback(async () => {
    if (!isAuthenticated) return
    
    toast.error('Your session has expired. Please sign in again.')
    await logout()
    navigate('/login')
  }, [isAuthenticated, logout, navigate])

  // Set up session timers
  const setupTimers = useCallback(() => {
    // Clear existing timers
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)

    if (!isAuthenticated) return

    // Set warning timer
    const warningMs = (sessionTimeoutMinutes - sessionWarningMinutes) * 60 * 1000
    warningTimerRef.current = setTimeout(handleSessionWarning, warningMs)

    // Set timeout timer
    const timeoutMs = sessionTimeoutMinutes * 60 * 1000
    timeoutTimerRef.current = setTimeout(handleSessionTimeout, timeoutMs)
  }, [
    isAuthenticated,
    sessionTimeoutMinutes,
    sessionWarningMinutes,
    handleSessionWarning,
    handleSessionTimeout,
  ])

  // Monitor user activity
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current
      
      // If more than 1 minute since last activity, reset timers
      if (timeSinceLastActivity > 60000) {
        updateActivity()
        setupTimers()
      }
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    // Initial timer setup
    setupTimers()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)
    }
  }, [isAuthenticated, setupTimers, updateActivity])

  // Check token validity on focus
  useEffect(() => {
    const handleFocus = async () => {
      if (!isAuthenticated) return
      
      const isValid = authService.isAuthenticated()
      if (!isValid) {
        toast.error('Your session has expired. Please sign in again.')
        await logout()
        navigate('/login')
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated, logout, navigate])

  return <>{children}</>
}

/**
 * useSessionActivity Hook
 * 
 * Hook to track user activity within components.
 */
export function useSessionActivity() {
  const lastActivityRef = useRef<number>(Date.now())
  
  const trackActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  const getIdleTime = useCallback(() => {
    return Date.now() - lastActivityRef.current
  }, [])

  const isIdle = useCallback((thresholdMs: number = 300000) => { // 5 minutes default
    return getIdleTime() > thresholdMs
  }, [getIdleTime])

  return {
    trackActivity,
    getIdleTime,
    isIdle,
  }
}