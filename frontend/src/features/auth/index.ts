/**
 * Authentication Feature Exports
 * 
 * Centralized exports for authentication components, hooks, and services.
 */

// Components
export { LandingPage } from './components/LandingPage'
export { LoginPage } from './components/LoginPage'
export { AuthCallback } from './components/AuthCallback'
export { ProtectedRoute } from './components/ProtectedRoute'
export { UserProfile, UserDropdown } from './components/UserProfile'
export { AuthStatus, AuthDebugInfo } from './components/AuthStatus'
export { SessionManager, useSessionActivity } from './components/SessionManager'

// Hooks
export { useAuth, useOAuthCallback, useRequireAuth } from './hooks/useAuth'

// Services
export { authService } from './services/authService'
export type { User, AuthResponse } from './services/authService'