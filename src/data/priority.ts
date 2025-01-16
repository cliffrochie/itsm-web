import { 
  ChevronDownCircle,
  ChevronUpCircle,
  CircleMinus,
  
} from "lucide-react"

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: ChevronDownCircle
  },
  {
    value: "medium",
    label: "Medium",
    icon: CircleMinus
  },
  {
    value: "high",
    label: "High",
    icon: ChevronUpCircle
  },
]
