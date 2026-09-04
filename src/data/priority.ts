import { ChevronDownCircle, ChevronUpCircle, CircleMinus, AlertTriangle } from "lucide-react";

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: ChevronDownCircle,
  },
  {
    value: "medium",
    label: "Medium",
    icon: CircleMinus,
  },
  {
    value: "high",
    label: "High",
    icon: ChevronUpCircle,
  },
  {
    value: "urgent",
    label: "Urgent",
    icon: AlertTriangle,
  },
];
