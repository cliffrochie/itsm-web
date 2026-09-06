import {
  LockOpen,
  Loader,
  CircleUser,
  CirclePause,
  TrendingUp,
  RefreshCwOff,
  RefreshCw,
  Check,
  Lock,
} from "lucide-react";

export const serviceStatuses = [
  {
    value: "open",
    label: "Open",
    icon: LockOpen,
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: Loader,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Loader,
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: Check,
  },
  {
    value: "closed",
    label: "Closed",
    icon: Lock,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: RefreshCwOff,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: RefreshCwOff,
  },
  {
    value: "assigned",
    label: "Assigned",
    icon: CircleUser,
  },
  {
    value: "on hold",
    label: "On Hold",
    icon: CirclePause,
  },
  {
    value: "escalated",
    label: "Escalated",
    icon: TrendingUp,
  },
  {
    value: "reopened",
    label: "Reopened",
    icon: RefreshCw,
  },
];
