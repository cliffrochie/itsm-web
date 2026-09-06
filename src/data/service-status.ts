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
];

export const legacyServiceStatuses = [
  {
    value: "assigned",
    label: "Assigned",
    icon: CircleUser,
  },
  {
    value: "on_hold",
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

export const getServiceStatus = (status?: string | null) => {
  if (!status) return undefined;
  const normalized =
    status === "in progress"
      ? "in_progress"
      : status === "canceled"
      ? "cancelled"
      : status;
  return (
    serviceStatuses.find((s) => s.value === normalized) ||
    legacyServiceStatuses.find((s) => s.value === status)
  );
};
