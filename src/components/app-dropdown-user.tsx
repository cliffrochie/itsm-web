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
import api from "@/services/use-api";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{user ? capitalizeFirstLetter(user.firstName) +' '+ capitalizeFirstLetter(user.lastName) : 'User'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLogoutButton() }>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}