import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Ticket, Tickets, TicketCheck, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import useGetTotalServiceStatus from "@/features/it-service-ticket/hooks/use-get-total-service-status"
import useGetTotalTaskType from "@/features/it-service-ticket/hooks/use-get-total-task-type";
import useGetTotalEquipmentType from "@/features/it-service-ticket/hooks/use-get-total-equipment-type";
import useGetTotalUserRole from "@/features/user/hooks/use-get-total-user-role";

interface TotalServiceStatus {
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

interface TotalTaskType {
  totalTickets: number
  totalIncident: number
  totalServiceRequest: number
  totalAssetRequest: number
  totalMaintenance: number
  totalConsultation: number
  totalAccessibility: number
}

interface EquipmentType {
  totalTickets: number
  totalComputer: number
  totalPrinter: number
  totalMobileDevice: number
  totalNetworkRelated: number
  totalSoftwareApplication: number
  totalOthers: number
}

interface UserRole {
  total: number
  totalAdmin: number
  totalStaff: number
  totalUser: number
}




export default function AdminPage() {
  const { totalServiceStatuses } = useGetTotalServiceStatus()
  let serviceStatusesData = [
    { keyName: 'totalOpenedTickets', name: "Opened", total: 0 },
    { keyName: 'totalInProgressTickets', name: "In-Progress", total: 0 },
    { keyName: 'totalOnHoldTickets', name: "On-Hold", total: 0 },
    { keyName: 'totalEscalatedTickets', name: "Escalated", total: 0 },
    { keyName: 'totalCanceledTickets', name: "Canceled", total: 0 },
    { keyName: 'totalReOpenedTickets', name: "Re-Opened", total: 0 },
    { keyName: 'totalResolvedTickets', name: "Resolved", total: 0 },
    { keyName: 'totalClosedTickets', name: "Closed", total: 0 },
  ]
  if(totalServiceStatuses) {
    serviceStatusesData = serviceStatusesData.map(item => ({
      ...item,
      total: totalServiceStatuses[item.keyName as keyof TotalServiceStatus] || 0
    }))
  }
  
  const { totalTaskTypes } = useGetTotalTaskType()
  let taskTypesData = [
    { keyName: 'totalIncident', name: "Incident", total: 0 },
    { keyName: 'totalServiceRequest', name: "Service Request", total: 0 },
    { keyName: 'totalAssetRequest', name: "Asset Request", total: 0 },
    { keyName: 'totalMaintenance', name: "Maintenance", total: 0 },
    { keyName: 'totalConsultation', name: "Consultation", total: 0 },
    { keyName: 'totalAccessibility', name: "Accessibility", total: 0 },
  ]
  if(totalTaskTypes) {
    taskTypesData = taskTypesData.map(item => ({
      ...item,
      total: totalTaskTypes[item.keyName as keyof TotalTaskType] || 0
    }))
  }

  const { totalEquipmentTypes } = useGetTotalEquipmentType()
  let equipmentTypesData = [
    { keyName: 'totalComputer', name: "Computer", total: 0 },
    { keyName: 'totalPrinter', name: "Printer", total: 0 },
    { keyName: 'totalMobileDevice', name: "Mobile Device", total: 0 },
    { keyName: 'totalNetworkRelated', name: "Network Related", total: 0 },
    { keyName: 'totalSoftwareApplication', name: "Software Application", total: 0 },
    { keyName: 'totalOthers', name: "Others", total: 0 },
  ]
  if(totalEquipmentTypes) {
    equipmentTypesData = equipmentTypesData.map(item => ({
      ...item,
      total: totalEquipmentTypes[item.keyName as keyof EquipmentType] || 0
    }))
  }

  const { totalUserRoles } = useGetTotalUserRole()
  let userRolesData = [
    { keyName: 'total', name: "Total Users", total: 0 },
    { keyName: 'totalAdmin', name: "Admin", total: 0 },
    { keyName: 'totalStaff', name: "Service Engineer", total: 0 },
    { keyName: 'totalUser', name: "Client", total: 0 },
  ]
  if(totalUserRoles) {
    userRolesData = userRolesData.map(item => ({
      ...item,
      total: totalUserRoles[item.keyName as keyof UserRole] || 0
    }))
  }
  
  // console.log(totalServiceStatuses)
  // console.log(totalTaskTypes)
  // console.log(totalEquipmentTypes)
  // console.log(totalUserRoles)
  


  return (
    <section className="grid gap-4">
      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              TOTAL TICKETS
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ totalServiceStatuses?.totalTickets || 0 }</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              TOTAL USERS
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ totalUserRoles?.total || 0 }</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              CLIENT POPULATION
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid custom-lg:grid-cols-3 custom-md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">Ticket service status population</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={serviceStatusesData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#8bb2f0" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">Ticket task type population</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={taskTypesData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#8fc98d" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">Ticket equipment type population</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={equipmentTypesData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#deb7ab" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">User roles population</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={userRolesData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#e8a0e4" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
