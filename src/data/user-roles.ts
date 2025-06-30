import { CircleUserRound, UsersRound, UserRoundPen } from "lucide-react";

export const roles = [
  {
    value: "user",
    label: "User",
    icon: UsersRound,
  },
  {
    value: "staff",
    label: "Staff",
    icon: CircleUserRound,
  },
  {
    value: "admin",
    label: "Admin",
    icon: UserRoundPen,
  },
];
