import { 
  Computer,
  Printer,
  TabletSmartphone,
  Network,
  AppWindow, 
  Dot, 
} from "lucide-react"

export const equipmentTypes = [
  {
    value: "computer",
    label: "Computer",
    icon: Computer
  },
  {
    value: "printer",
    label: "Printer",
    icon: Printer
  },
  {
    value: "mobile device",
    label: "Mobile Device",
    icon: TabletSmartphone
  },
  {
    value: "network",
    label: "Network Related",
    icon: Network
  },
  {
    value: "software application",
    label: "Software Application",
    icon: AppWindow
  },
  {
    value: "others",
    label: "Others",
    icon: Dot
  },
]
