import { Plane, MapPin, Users, Vote } from 'lucide-react'
import { auth } from '@/utils/auth'
import { useEffect } from 'react'
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

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleStartPlanning = () => {
    navigate('/login')
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
          
          {/* Call to Action */}
          <div className="mt-8">
            <button
              onClick={handleStartPlanning}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Planning Your Trip
            </button>
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