import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import DropdownUser from '@/components/app-dropdown-user';
import Logo from '@/assets/logo.svg'
import { useMediaQuery } from 'react-responsive'

export default function UserLayout() {
  const { handleLogout } = useAuth()
  const isSmallScreen = useMediaQuery({ maxWidth: 600 })

  return (
    <>
      <nav className="px-8 border-b-[0.5px] border-gray-200 mb-4">
        <div className="flex align-middle items-center justify-between mt-1 mb-1 ">
          {/* Logo */}
          <div className="flex items-center gap-4 ">
            <img src={Logo} width="45" alt="logo" className="" />
            <p className="text-lg font-semibold">{isSmallScreen ? 'ITSM' : 'IT Service Management System'}</p>
          </div>
          
          {/* Dropdown on the right */}
          <DropdownUser />
        </div>
        
      </nav>
      <Outlet /> {/* Render child routes */}
      <ToastContainer />
      </>
  )
}