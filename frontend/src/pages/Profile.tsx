import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/utils/auth'
import { authService } from '@/features/auth/services/authService'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { Layout } from '@/shared/components/Layout'
import { User, Mail, Calendar, Settings, LogOut, Shield, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(auth.getUser())
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'privacy'>('profile')

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/login')
      return
    }

    // Refresh user data
    refreshUserData()
  }, [navigate])

  const refreshUserData = async () => {
    try {
      setIsLoading(true)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      toast.error('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      // TODO: Implement account deletion API
      toast.error('Account deletion not yet implemented')
    } catch (error) {
      console.error('Account deletion failed:', error)
      toast.error('Failed to delete account')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="flex items-center gap-6">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-12 h-12 text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-secondary-900">{user.name}</h2>
              <p className="text-secondary-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-secondary-500 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-secondary-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Privacy
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg bg-secondary-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg bg-secondary-50"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-secondary-600">
                  Profile information is managed through your Google account
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Travel Preferences
                </h3>
                <p className="text-secondary-600">
                  Travel preferences will be available in a future update
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary-900">Email Notifications</h4>
                    <p className="text-sm text-secondary-600">
                      Receive updates about your trips and invitations
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary-900">Trip Reminders</h4>
                    <p className="text-sm text-secondary-600">
                      Get notified about upcoming trips and activities
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Privacy & Security
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-900 mb-2">
                    Account Visibility
                  </h4>
                  <p className="text-sm text-secondary-600 mb-4">
                    Control who can see your profile and trip history
                  </p>
                  <select className="w-full px-4 py-2 border border-secondary-300 rounded-lg">
                    <option>Public</option>
                    <option>Friends Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}