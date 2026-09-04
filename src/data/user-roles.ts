import { CircleUserRound, UsersRound, UserRoundPen, Wrench } from "lucide-react";

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
    value: "service_engineer",
    label: "Service Engineer",
    icon: Wrench,
  },
  {
    value: "admin",
    label: "Admin",
    icon: UserRoundPen,
  },
];
