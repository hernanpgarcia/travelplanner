import { Link, useLocation } from 'react-router-dom'
import { MapPin, User, LogOut } from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="bg-white border-b border-secondary-200 shadow-soft">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-900">
              TravelPlanner
            </span>
          </Link>
          
          {/* Navigation Links */}
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
              to="/trips"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/trips')
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              My Trips
            </Link>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">
                Profile
              </span>
            </button>
            <button className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}