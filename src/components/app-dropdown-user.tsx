import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/features/auth/api/logout";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils";

export default function DropdownUser() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  async function handleLogoutButton() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/auth/login");
    }
  }

  function handleProfileButton() {
    if (!user) return;
    if (user.role === "admin") {
      navigate("/admin/user-profile");
    } else if (user.role === "staff" || user.role === "service_engineer") {
      navigate("/service-engineer/user-profile");
    } else if (user.role === "user") {
      navigate("/client/user-profile");
    }
  }

  const displayName = user
    ? [user.firstName, user.lastName]
        .filter(Boolean)
        .map((n) => capitalizeFirstLetter(n))
        .join(" ") ||
      user.username ||
      user.email ||
      "User"
    : "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost">{displayName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleProfileButton()}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLogoutButton()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
