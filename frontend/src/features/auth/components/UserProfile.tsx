/**
 * UserProfile Component
 * 
 * Displays user information and logout functionality.
 */

import { LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className = '' }: UserProfileProps) {
  const { user, logout, isLoading } = useAuth()

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* User Avatar */}
      <div className="flex items-center gap-2">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-primary-600" />
          </div>
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-secondary-900">{user.name}</p>
          <p className="text-xs text-secondary-500">{user.email}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors disabled:opacity-50"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}

/**
 * UserDropdown Component
 * 
 * Dropdown version of user profile for navigation bars.
 */

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export function UserDropdown({ className = '' }: UserProfileProps) {
  const { user, logout, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-50 transition-colors"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-primary-600" />
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-secondary-900">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4 text-secondary-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-secondary-100">
            <p className="text-sm font-medium text-secondary-900">{user.name}</p>
            <p className="text-xs text-secondary-500">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}