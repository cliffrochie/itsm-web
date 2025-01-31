import { 
  CircleAlert,
  Laptop,
  BookUser, 
  Bike, 
  RefreshCwOff,
  HandPlatter,
  Info
} from "lucide-react"

export const taskTypes = [
  {
    value: "incident",
    label: "Incident",
    icon: CircleAlert
  },
  {
    value: "service request",
    label: "Service Request",
    icon: HandPlatter
  },
  {
    value: "asset request",
    label: "Asset Request",
    icon: Laptop
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: RefreshCwOff
  },
  {
    value: "training",
    label: "Training",
    icon: Bike
  },
  {
    value: "consultation",
    label: "Consultation",
    icon: BookUser
  },
  {
    value: "accessibility",
    label: "Accessibility",
    icon: Info
  },
]
