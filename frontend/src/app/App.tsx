import { Routes, Route } from 'react-router-dom'

// Import shared components
import { Layout } from '@/shared/components/Layout'

// Import features (these will be lazy loaded in production)
import { HomePage } from '@/pages/HomePage'
import { Dashboard } from '@/pages/Dashboard'
import { AuthSuccess } from '@/pages/AuthSuccess'
import { LandingPage } from '@/features/auth/components/LandingPage'
import { AuthCallbackSimple } from '@/features/auth/components/AuthCallbackSimple'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallbackSimple />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/trips/:tripId" element={
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-secondary-900 mb-2">
                Trip Dashboard
              </h1>
              <p className="text-secondary-600">
                Trip dashboard implementation coming soon...
              </p>
            </div>
          </div>
        </Layout>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">404</h1>
            <p className="text-secondary-600 mb-4">Page not found</p>
            <a 
              href="/" 
              className="btn btn-primary btn-md"
            >
              Go Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App