/**
 * AuthStatus Component
 * 
 * Displays the current authentication status and provides quick actions.
 * Useful for debugging and showing auth state in development.
 */

import { Shield, ShieldOff, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthStatusProps {
  className?: string
  showDetails?: boolean
}

export function AuthStatus({ className = '', showDetails = false }: AuthStatusProps) {
  const { user, isAuthenticated, isLoading, error, refreshUser } = useAuth()

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-secondary-600 ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking authentication...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Auth Status Icon */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Shield className="h-4 w-4 text-success-600" />
            <span className="text-sm font-medium text-success-700">Authenticated</span>
          </>
        ) : (
          <>
            <ShieldOff className="h-4 w-4 text-secondary-400" />
            <span className="text-sm font-medium text-secondary-600">Not authenticated</span>
          </>
        )}
      </div>

      {/* User Details (if authenticated and showDetails is true) */}
      {showDetails && isAuthenticated && user && (
        <div className="text-sm text-secondary-600">
          as <span className="font-medium text-secondary-900">{user.email}</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-sm text-danger-600">
          {error}
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={refreshUser}
        className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
        title="Refresh authentication status"
      >
        <RefreshCw className="h-3 w-3" />
      </button>
    </div>
  )
}

/**
 * AuthDebugInfo Component
 * 
 * Shows detailed authentication information for debugging purposes.
 * Should only be used in development environments.
 */
export function AuthDebugInfo({ className = '' }: { className?: string }) {
  const { user, isAuthenticated, isLoading, error } = useAuth()
  const token = localStorage.getItem('access_token')
  const storedUser = localStorage.getItem('user')

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className={`bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-sm ${className}`}>
      <h3 className="font-semibold text-secondary-900 mb-2">Authentication Debug Info</h3>
      
      <div className="space-y-1 font-mono text-xs">
        <div>
          <span className="text-secondary-600">Status:</span>{' '}
          <span className={isAuthenticated ? 'text-success-600' : 'text-danger-600'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        <div>
          <span className="text-secondary-600">Loading:</span>{' '}
          <span>{isLoading ? 'Yes' : 'No'}</span>
        </div>
        
        <div>
          <span className="text-secondary-600">Error:</span>{' '}
          <span className="text-danger-600">{error || 'None'}</span>
        </div>
        
        <div>
          <span className="text-secondary-600">User:</span>{' '}
          <span>{user ? `${user.name} (${user.email})` : 'None'}</span>
        </div>
        
        <div>
          <span className="text-secondary-600">Token:</span>{' '}
          <span>{token ? `${token.substring(0, 20)}...` : 'None'}</span>
        </div>
        
        <div>
          <span className="text-secondary-600">Stored User:</span>{' '}
          <span>{storedUser ? 'Present' : 'None'}</span>
        </div>
      </div>
    </div>
  )
}