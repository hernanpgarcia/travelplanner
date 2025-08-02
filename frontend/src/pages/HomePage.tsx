import { useNavigate } from 'react-router-dom'
import { auth } from '@/utils/auth'
import { useEffect, useState } from 'react'

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
    <div className="relative size-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-between px-[100px] py-2.5 relative size-full">
          <div className="font-['Inter:Black',_sans-serif] font-black leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left text-nowrap">
            <p className="block leading-[normal] whitespace-pre">
              TravelPlanner
            </p>
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleDashboard}
                className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </button>
              <span className="text-sm text-secondary-600">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-secondary-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
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
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative size-full">
      <div className="h-[105px] relative shrink-0 w-full">
        <Header />
      </div>
      <div className="[flex-flow:wrap] box-border content-center flex gap-[50px] items-center justify-center max-w-[1100px] min-h-[620px] min-w-[374px] p-0 relative shrink-0 w-full">
        <div className="basis-0 bg-[#d9d9d9] grow max-h-[620px] max-w-[520px] min-h-px min-w-[375px] relative shrink-0">
          <div className="max-h-inherit max-w-inherit min-w-inherit overflow-clip relative size-full">
            <div className="box-border content-stretch flex flex-col gap-[18px] items-start justify-start max-h-inherit max-w-inherit min-w-inherit px-[33px] py-[41px] relative w-full">
              <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[normal] not-italic relative shrink-0 text-[#000000] text-[0px] text-left w-full">
                <p className="block font-['Inter:Black',_sans-serif] font-black mb-0 text-[32px]">
                  Turn group travel chaos 
                  <br />
                  into collaborative adventure
                </p>
                <p className="block text-[14px]">
                  <br />
                  Planning multi-city trips with friends means endless group
                  chats and decision paralysis. TravelPlanner lets groups
                  democratically vote on destinations in real-time, build
                  detailed city-by-city itineraries together, and make final
                  decisions based on transparent group input. Stop arguing about
                  where to go—start planning amazing trips together.
                </p>
              </div>
              <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-[18px] h-80 items-center justify-center leading-[0] not-italic overflow-clip p-0 relative shrink-0 text-[#000000] text-[14px] text-left w-full">
                <div className="basis-0 flex flex-col grow justify-center leading-[normal] min-h-px min-w-px relative shrink-0">
                  <p className="block font-['Inter:Bold',_sans-serif] font-bold mb-0">
                    Democratic Travel Decisions
                  </p>
                  <p className="block">
                    TravelPlanner uses transparent 3-option voting (Like/Don't mind/Dislike) so every group member has a voice.
                  </p>
                </div>
                <div className="basis-0 flex flex-col grow justify-center leading-[normal] min-h-px min-w-px relative shrink-0">
                  <p className="block font-['Inter:Bold',_sans-serif] font-bold mb-0">
                    City-by-City Collaboration
                  </p>
                  <p className="block">
                    While most apps focus on single destinations, TravelPlanner specializes in complex multi-city trips.
                  </p>
                </div>
                <div className="basis-0 flex flex-col grow justify-center leading-[normal] min-h-px min-w-px relative shrink-0">
                  <p className="block font-['Inter:Bold',_sans-serif] font-bold mb-0 not-italic">
                    Real-Time Group Planning
                  </p>
                  <p className="block">
                    Experience truly live collaboration with instant vote
                    updates, real-time member activity, and immediate
                    notifications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-0 bg-[rgba(217,217,217,0)] grow max-h-[620px] max-w-[520px] min-h-[120px] min-w-[375px] relative shrink-0">
          <div className="flex flex-col items-center justify-center max-h-inherit max-w-inherit min-h-inherit min-w-inherit relative size-full">
            <div className="box-border content-stretch flex flex-col items-center justify-center max-h-inherit max-w-inherit min-h-inherit min-w-inherit px-[135px] py-[39px] relative w-full">
              <button 
                onClick={handleStartPlanning}
                className="flex flex-col font-['Inter:Black',_sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[35px] text-center w-[251px] hover:text-primary-600 transition-colors cursor-pointer"
              >
                <p className="[text-decoration-line:underline] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[normal]">
                  Start Planning
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}