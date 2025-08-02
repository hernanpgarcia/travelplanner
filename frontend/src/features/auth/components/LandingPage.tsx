import { Loader2 } from 'lucide-react'
import { auth } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Google sign-in button image (will create fallback if not available)

function Header() {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="relative size-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-[100px] py-2.5 relative size-full">
          <button
            onClick={handleHome}
            className="font-['Inter:Black',_sans-serif] font-black leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left text-nowrap hover:text-primary-600 transition-colors"
          >
            <p className="block leading-[normal] whitespace-pre">
              TravelPlanner
            </p>
          </button>
        </div>
      </div>
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
      
      // Get Google OAuth URL from backend
      const response = await fetch('http://localhost:8000/api/v1/auth/google/url')
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL')
      }
      
      const data = await response.json()
      // Redirect to Google OAuth
      window.location.href = data.url
    } catch (err) {
      console.error('Sign in failed:', err)
      setError('Failed to start sign in process. Please try again.')
      setIsLoading(false)
    }
  }
  
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative size-full">
      <div className="h-[105px] relative shrink-0 w-full">
        <Header />
      </div>
      <div className="box-border content-stretch flex flex-row gap-[50px] h-[620px] items-start justify-center max-w-[1100px] min-h-[620px] min-w-[374px] p-0 relative shrink-0 w-full">
        <div className="basis-0 bg-[#d9d9d9] grow h-full max-w-[520px] min-h-px min-w-[375px] relative shrink-0">
          <div className="max-w-inherit min-w-inherit overflow-clip relative size-full">
            <div className="box-border content-stretch flex flex-col gap-[18px] items-start justify-start max-w-inherit min-w-inherit px-[33px] py-[41px] relative size-full">
              <div className="basis-0 flex flex-col font-['Inter:Black',_sans-serif] font-black grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[32px] text-left w-full">
                <p className="block leading-[normal]">
                  Create an account to to start planning your trip
                </p>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <div className="basis-0 box-border content-stretch flex flex-row gap-[18px] grow items-center justify-center min-h-px min-w-px overflow-clip p-0 relative shrink-0 w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2 text-secondary-600">Signing in...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 h-[70px] w-[306px] cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
        </div>
      </div>
    </div>
  )
}