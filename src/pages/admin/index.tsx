import { Ticket, Tickets, TicketCheck, Users } from "lucide-react"

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
import useGetTotalTickets from "@/services/it-service-tickets/use-get-total-tickets"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "January", sales: 40 },
  { name: "February", sales: 30 },
  { name: "March", sales: 20 },
  { name: "April", sales: 27 },
  { name: "May", sales: 18 },
  { name: "June", sales: 23 },
];


interface Tickets {
  totalTickets: number
  totalOpenedTickets: number
  totalInProgressTickets: number
  totalOnHoldTickets: number
  totalEscalatedTickets: number
  totalCanceledTickets: number
  totalReOpenedTickets: number
  totalResolvedTickets: number
  totalClosedTickets: number
}



export default function AdminPage() {
  const { tickets } = useGetTotalTickets()
  console.log(tickets)

  let ticketsData = [
    { keyName: 'totalOpenedTickets', name: "Opened", total: 0 },
    { keyName: 'totalInProgressTickets', name: "In-Progress", total: 0 },
    { keyName: 'totalOnHoldTickets', name: "On-Hold", total: 0 },
    { keyName: 'totalEscalatedTickets', name: "Escalated", total: 0 },
    { keyName: 'totalCanceledTickets', name: "Canceled", total: 0 },
    { keyName: 'totalReOpenedTickets', name: "Re-Opened", total: 0 },
    { keyName: 'totalResolvedTickets', name: "Resolved", total: 0 },
    { keyName: 'totalClosedTickets', name: "Closed", total: 0 },
  ]


  if(tickets) {
    ticketsData = ticketsData.map(item => ({
      ...item,
      total: tickets[item.keyName as keyof Tickets] || 0
    }))
  }
  
  console.log(ticketsData)
  


  return (
    <section className="grid gap-4">
      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              Total tickets
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ tickets?.totalTickets || 0 }</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              IT population
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              Client population
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">Ticket status population</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketsData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#8bb2f0" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
