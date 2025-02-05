import { Ticket, Tickets, TicketCheck } from "lucide-react"

import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Navigate } from "react-router-dom"

export default function AdminPage() {

  // const { user } = useAuth()
  // if(user) {
  //   console.log(user)
  //   if(user.role === 'user') {
  //     return <Navigate to='/' replace />
  //   } 
  // }

  return (
    <section className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-2">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
            Opened Tickets
          </CardTitle>
          <Ticket className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">21</div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
            Other tickets
          </CardTitle>
          <Tickets className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">21</div>
        </CardContent>
      </Card>
      <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
            Closed tickets
          </CardTitle>
          <TicketCheck className="text-gray-500"  />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">21</div>
        </CardContent>
      </Card>
    </section>
  )
}
