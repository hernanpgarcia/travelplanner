import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { UserDropdown } from '@/features/auth/components/UserProfile'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  return (
    <nav className="bg-white border-b border-secondary-200 shadow-soft">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-900">
              TravelPlanner
            </span>
          </Link>
          
          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/profile'
                    ? 'text-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                My Profile
              </Link>
            </div>
          )}
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}