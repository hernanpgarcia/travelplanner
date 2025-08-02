import { useNavigate } from 'react-router-dom'
import { auth } from '@/utils/auth'
import { useEffect, useState } from 'react'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(auth.getUser())

  useEffect(() => {
    setUser(auth.getUser())
  }, [])

  const handleLogout = () => {
    auth.logout()
    navigate('/')
    window.location.reload()
  }

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="relative size-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-between px-[100px] py-2.5 relative size-full">
          <button
            onClick={handleHome}
            className="font-['Inter:Black',_sans-serif] font-black leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left text-nowrap hover:text-primary-600 transition-colors"
          >
            <p className="block leading-[normal] whitespace-pre">
              TravelPlanner
            </p>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">
              {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-secondary-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative size-full">
      <div className="h-[105px] relative shrink-0 w-full">
        <Header />
      </div>
      <div className="box-border content-stretch flex flex-row gap-[50px] h-[620px] items-start justify-center max-w-[1100px] min-h-[620px] min-w-[374px] p-0 relative shrink-0 w-full">
        <div className="basis-0 bg-[#d9d9d9] grow h-full min-h-px min-w-[375px] relative shrink-0">
          <div className="min-w-inherit overflow-clip relative size-full">
            <div className="box-border content-stretch flex flex-col gap-[18px] items-start justify-start min-w-inherit px-[33px] py-[41px] relative size-full">
              <div className="flex flex-col font-['Inter:Black',_sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-left w-full">
                <p className="block leading-[normal]">Login successful</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}