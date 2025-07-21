import { MapPin, Users, Vote, Calendar } from 'lucide-react'

export function LandingPage() {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Google Sign In - TODO')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="container">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <MapPin className="h-16 w-16 text-primary-600" />
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 text-balance">
              Make collaborative travel planning{' '}
              <span className="text-primary-600">effortless</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-secondary-600 mb-12 text-balance max-w-3xl mx-auto">
              Eliminate endless group chats and decision paralysis. 
              Decide where to go together, one city at a time.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={handleGoogleSignIn}
              className="btn btn-primary btn-lg text-lg px-8 py-4 mb-16"
            >
              Start Planning with Google
            </button>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  True Collaboration
                </h3>
                <p className="text-secondary-600">
                  Democratic voting with clear ownership. Everyone's voice is heard.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Vote className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Fast Decisions
                </h3>
                <p className="text-secondary-600">
                  Simple voting tools eliminate decision paralysis and speed up planning.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  City-First Planning
                </h3>
                <p className="text-secondary-600">
                  Focus on cities, not countries. Perfect for multi-city adventures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}