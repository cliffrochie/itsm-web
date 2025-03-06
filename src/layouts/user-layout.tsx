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
  const isSmallScreen = useMediaQuery({ maxWidth: 600 })

  return (
    <>
      <nav className="px-8 border-b-[0.5px] border-gray-200 mb-7 sticky top-0 p-1 bg-white z-10">
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
      <section className="grid mx-4 custom-md:grid-cols-1 gap-4 custom-xl:mx-72 custom-lg:mx-60 custom-md:mx-36 custom-sm:mx-20">
        <Outlet /> {/* Render child routes */}
        <ToastContainer />
      </section>
      </>
  )
}