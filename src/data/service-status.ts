import { 
  LockOpen,
  Loader,
  CirclePause,
  TrendingUp,
  RefreshCwOff, 
  RefreshCw, 
  Check,
  Lock,
  Circle
} from "lucide-react"

export const serviceStatuses = [
  {
    value: "open",
    label: "Open",
    icon: LockOpen
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Loader
  },
  {
    value: "on hold",
    label: "On Hold",
    icon: CirclePause
  },
  {
    value: "escalated",
    label: "Escalated",
    icon: TrendingUp
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: RefreshCwOff
  },
  {
    value: "reopened",
    label: "Reopened",
    icon: RefreshCw
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: Check
  },
  {
    value: "closed",
    label: "Closed",
    icon: Lock
  },
]
