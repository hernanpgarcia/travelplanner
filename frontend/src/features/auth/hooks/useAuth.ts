/**
 * Authentication Hooks
 * 
 * React hooks for managing authentication state and user data.
 */

import { useState, useEffect, useCallback } from 'react'
import { authService, User } from '../services/authService'

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

/**
 * Main authentication hook
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setError(null)
    } catch (err) {
      console.error('Error refreshing user:', err)
      setError('Failed to get user information')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.initiateGoogleOAuth()
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to initiate login')
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      setError('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser()
      
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser)
        // Verify token is still valid
        await refreshUser()
      } else {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [refreshUser])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  }
}

/**
 * Hook for handling OAuth callback
 */
export function useOAuthCallback() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCallback = useCallback(async (code: string, state?: string): Promise<User | null> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const authResponse = await authService.handleGoogleCallback(code, state)
      return authResponse.user
    } catch (err) {
      console.error('OAuth callback error:', err)
      setError('Authentication failed. Please try again.')
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    processCallback,
    isProcessing,
    error,
  }
}

/**
 * Hook for protected routes
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  }
}