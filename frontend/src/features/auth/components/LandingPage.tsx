import { Loader2, Plane, MapPin, Users, Vote } from 'lucide-react'
import { auth } from '@/utils/auth'
import { authService } from '@/features/auth/services/authService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-between px-8 py-2.5 relative size-full">
      <button
        onClick={handleHome}
        className="font-roboto font-black leading-[0] relative shrink-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 text-[32px] text-left text-nowrap uppercase"
      >
        <p className="block leading-[normal] whitespace-pre flex items-center gap-3">
          <Plane className="w-8 h-8 text-primary-600" />
          TravelPlanner
        </p>
      </button>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use authService to initiate Google OAuth
      await authService.initiateGoogleOAuth()
    } catch (err) {
      console.error('Sign in failed:', err)
      setError('Failed to start sign in process. Please try again.')
      setIsLoading(false)
    }
  }
  
  return (
    <div className="bg-gradient-to-br from-[#ffffff] via-[#fafafa] to-[#f5f5f5] box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative min-h-screen size-full">
      {/* Header */}
      <div className="box-border content-stretch flex flex-row gap-2.5 h-[105px] items-center justify-center w-full max-w-[1280px] px-8">
        <Header />
      </div>
      
      {/* Main Content */}
      <div className="box-border content-stretch flex flex-row gap-[80px] items-start justify-center max-w-[1200px] min-h-[620px] overflow-clip px-8 py-[61px] relative shrink-0">
        {/* Left Side - Product Explanation */}
        <div className="flex flex-col gap-[24px] items-start justify-start max-w-[520px] min-w-[375px] relative shrink-0">
          <div className="flex flex-col font-questrial justify-center relative shrink-0 text-[64px] tracking-[-1px] uppercase text-secondary-900">
            <p className="block leading-[56px]">
              Turn group travel chaos into collaborative adventure
            </p>
          </div>
          <div className="flex flex-col font-sans font-normal justify-center relative shrink-0 text-[22px] text-secondary-700 leading-[32px]">
            <p className="block">
              Planning multi-city trips with friends means endless group chats
              and decision paralysis. TravelPlanner lets groups democratically
              vote on destinations in real-time, build detailed city-by-city
              itineraries together, and make final decisions based on
              transparent group input. Stop arguing about where to go—start
              planning amazing trips together.
            </p>
          </div>
          
          {/* Sign In Section */}
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Create an account to start planning your trip
            </h2>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex items-center justify-start">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  <span className="ml-2 text-secondary-600">Signing in...</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 h-[50px] cursor-pointer hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </g>
                  </svg>
                  <span className="text-gray-700 font-medium">Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - USP Section */}
        <div className="flex flex-col gap-[32px] items-start justify-start max-w-[520px] min-w-[375px] relative shrink-0">
          <div className="flex flex-col font-sans font-bold justify-center relative shrink-0 text-[28px] uppercase w-full text-secondary-900">
            <p className="block leading-[normal]">Why choose travelplanner?</p>
          </div>
          
          <div className="flex flex-col gap-[24px] w-full">
            <div className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Vote className="w-8 h-8 text-primary-600 shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <p className="font-sans font-bold text-[20px] uppercase text-secondary-900">
                    Democratic Travel Decisions
                  </p>
                  <p className="font-sans text-[18px] text-secondary-600 leading-[26px]">
                    TravelPlanner uses transparent 3-option voting (Like/Don't mind/Dislike) so every group member has a voice.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-primary-600 shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <p className="font-sans font-bold text-[20px] uppercase text-secondary-900">
                    City-by-City Collaboration
                  </p>
                  <p className="font-sans text-[18px] text-secondary-600 leading-[26px]">
                    While most apps focus on single destinations, TravelPlanner specializes in complex multi-city trips.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-primary-600 shrink-0 mt-1" />
                <div className="flex flex-col gap-2">
                  <p className="font-sans font-bold text-[20px] uppercase text-secondary-900">
                    Real-Time Group Planning
                  </p>
                  <p className="font-sans text-[18px] text-secondary-600 leading-[26px]">
                    Experience truly live collaboration with instant vote updates,
                    real-time member activity, and immediate notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}