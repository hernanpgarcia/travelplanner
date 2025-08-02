import { useNavigate } from 'react-router-dom'
import { auth } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { Plane, Users, Vote, MapPin } from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(auth.getUser())
  const isAuthenticated = auth.isAuthenticated()

  useEffect(() => {
    setUser(auth.getUser())
  }, [])

  const handleLogout = () => {
    auth.logout()
    navigate('/')
    window.location.reload()
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-between px-8 py-2.5 relative size-full">
      <div className="font-roboto font-black leading-[0] relative shrink-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 text-[32px] text-left text-nowrap uppercase">
        <p className="block leading-[normal] whitespace-pre flex items-center gap-3">
          <Plane className="w-8 h-8 text-primary-600" />
          TravelPlanner
        </p>
      </div>
      
      {isAuthenticated && user && (
        <div className="flex items-center gap-6">
          <button
            onClick={handleDashboard}
            className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
          >
            Dashboard
          </button>
          <span className="text-sm font-medium text-secondary-600">
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-secondary-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate()
  const isAuthenticated = auth.isAuthenticated()

  const handleStartPlanning = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#ffffff] via-[#fafafa] to-[#f5f5f5] box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative min-h-screen size-full">
      {/* Fixed CTA Bar */}
      <div className="fixed bg-white/95 backdrop-blur-md bottom-0 box-border content-stretch flex flex-col items-center justify-end left-0 right-0 min-h-[120px] px-8 py-5 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        <div
          aria-hidden="true"
          className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none"
        />
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center">
          <button
            onClick={handleStartPlanning}
            className="group flex flex-col font-roboto font-black justify-center leading-[0] relative shrink-0 text-[45px] text-center text-nowrap uppercase transition-all duration-300 hover:scale-105"
          >
            <p className="[text-decoration-line:underline] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[normal] whitespace-pre text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 group-hover:from-primary-700 group-hover:to-primary-900">
              Start Planning
            </p>
          </button>
          <div className="flex flex-col font-sans h-5 justify-end leading-[0] not-italic relative shrink-0 text-[#616161] text-[15px] text-center uppercase w-[486px] mt-2">
            <p className="block leading-[20px]">
              Create your first collaborative trip in minutes
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="box-border content-stretch flex flex-row gap-2.5 h-[105px] items-center justify-center w-full max-w-[1280px] px-8">
        <Header />
      </div>
      
      {/* Main Content */}
      <div className="box-border content-stretch flex flex-row gap-[80px] items-start justify-center max-w-[1200px] min-h-[620px] overflow-clip px-8 py-[61px] relative shrink-0">
        {/* Product Explanation */}
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
        </div>

        {/* USP Section */}
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
      
      {/* Spacer for fixed bar */}
      <div className="h-[140px]"></div>
    </div>
  );
}