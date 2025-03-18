import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context";
import api from "@/hooks/use-api";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils";

export default function DropdownUser() {
  const navigate = useNavigate()
  const { user, loading, handleLogout } = useAuth()

  async function handleLogoutButton() {
    try {
      const response = await api.post('/api/users/signout')
      if(response.status === 200) {
        handleLogout()
        navigate('/')
      }
    }
    catch(error) {
      console.error(error)
    }
  }

  async function handleProfileButton() {
    try {
      
      if(user && user.role === 'admin') {
        navigate('/admin/user-profile')
      }
      else if(user && user.role === 'staff') {
        navigate('/service-engineer/user-profile')
      }
      else if(user && user.role === 'user') {
        navigate('/client/user-profile')
      }
    }
    catch(error) {
      console.error(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost">
          {user ? capitalizeFirstLetter(user.firstName) +' '+ capitalizeFirstLetter(user.lastName) : 'User'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleProfileButton() }>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLogoutButton() }>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}