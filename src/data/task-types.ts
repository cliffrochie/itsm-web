import { 
  CircleAlert,
  ServerCrash,
  BookUser, 
  Bike, 
  RefreshCwOff,
  HandPlatter
} from "lucide-react"

export const taskTypes = [
  {
    value: "incident",
    label: "Incident",
    icon: CircleAlert
  },
  {
    value: "problem",
    label: "Problem",
    icon: ServerCrash
  },
  {
    value: "service request",
    label: "Service Request",
    icon: HandPlatter
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
]
