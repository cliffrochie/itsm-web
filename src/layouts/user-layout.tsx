import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import DropdownUser from '@/components/app-dropdown-user';

export default function UserLayout() {
  const { handleLogout } = useAuth()

  return (
    <>
      <nav className="flex items-center justify-between px-9 py-3 border-b-[0.5px] border-gray-200">
        {/* Logo */}
        <div className="text-xl font-bold font-mono">NIA ITSM</div>
        
        {/* Dropdown on the right */}
        <DropdownUser />
      </nav>
      <Outlet /> {/* Render child routes */}
      <ToastContainer />
      </>
  )
}