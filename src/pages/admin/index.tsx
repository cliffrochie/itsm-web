import { useState } from "react"
import { Ticket, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import useGetTotalServiceStatus from "@/hooks/it-service-ticket--use-get-total-service-status"
import useGetTotalTaskType from "@/hooks/it-service-ticket--use-get-total-task-type"
import useGetTotalEquipmentType from "@/hooks/it-service-ticket--use-get-total-equipment-type"
import useGetTotalUserRole from "@/hooks/user--use-get-total-user-role"
import api from "@/hooks/use-api";
import DataListDialog from "@/components/dialogs/dashboard--data-list-dialog"
import UserListDialog from "@/components/dialogs/dashboard--user-list-dialog"


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
    { keyName: 'totalAssignedTickets', name: "Assigned", total: 0 },
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
    { keyName: 'totalScanner', name: "Scanner", total: 0 },
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


  const [dataListDialog, setDataListDialog] = useState(false)
  const [userListDialog, setUserListDialog] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [dialogTitle, setDialogTitle] = useState('')
  const [selectedData, setSelectedData] = useState<any[]>([])
  const [totalClient, setTotalClient] = useState(0)

  async function getTotalClients() {
    try { 
      const result = await api.get('/api/clients')
      setTotalClient(result.data.total)
    }
    catch(error: any) {
      console.log(error)
    }
  }
  getTotalClients()
  
  async function handleServiceStatusPopulationClick(data: any) {
    try {
      switch(data.name) {
        case 'Opened':
          const openedTickets = await api.get(`/api/service-tickets/?serviceStatus=open&sort=-createdBy`)
          console.log(openedTickets)
          setDialogTitle('Opened Tickets')
          setSelectedId(openedTickets.data.results._id)
          setSelectedName(openedTickets.data.results.ticketNo)
          setSelectedData(openedTickets.data.results)
          console.log(openedTickets.data.results._id)
          break
        case 'Assigned':
          const assignedTickets = await api.get(`/api/service-tickets/?serviceStatus=assigned&sort=-createdBy`)
          setDialogTitle('Assigned Tickets')
          setSelectedId(assignedTickets.data.results._id)
          setSelectedName(assignedTickets.data.results.ticketNo)
          setSelectedData(assignedTickets.data.results)
          console.log(assignedTickets)
          break
        case 'In-Progress':
          const inProgressTickets = await api.get(`/api/service-tickets/?serviceStatus=in progress&sort=-createdBy`)
          setDataListDialog(true)
          setDialogTitle('In-Progress Tickets')
          setSelectedId(inProgressTickets.data.results._id)
          setSelectedName(inProgressTickets.data.results.ticketNo)
          setSelectedData(inProgressTickets.data.results)
          console.log(inProgressTickets)
          break
        case 'On-Hold':
          const onHoldTickets = await api.get(`/api/service-tickets/?serviceStatus=on hold&sort=-createdBy`)
          setDialogTitle('On-Hold Tickets')
          setSelectedId(onHoldTickets.data.results._id)
          setSelectedName(onHoldTickets.data.results.ticketNo)
          setSelectedData(onHoldTickets.data.results)
          console.log(onHoldTickets)
          break
        case 'Escalated':
          const escalatedTickets = await api.get(`/api/service-tickets/?serviceStatus=escalated&sort=-createdBy`)
          setDialogTitle('Escalated Tickets')
          setSelectedId(escalatedTickets.data.results._id)
          setSelectedName(escalatedTickets.data.results.ticketNo)
          setSelectedData(escalatedTickets.data.results)
          console.log(escalatedTickets)
          break
        case 'Canceled':
          const canceledTickets = await api.get(`/api/service-tickets/?serviceStatus=canceled&sort=-createdBy`)
          setDialogTitle('Canceled Tickets')
          setSelectedId(canceledTickets.data._id)
          setSelectedName(canceledTickets.data.ticketNo)
          setSelectedData(canceledTickets.data)
          console.log(canceledTickets)
          break
        case 'Re-Opened':
          const reOpenedTickets = await api.get(`/api/service-tickets/?serviceStatus=reopened&sort=-createdBy`)
          setDialogTitle('Re-Opened Tickets')
          setSelectedId(reOpenedTickets.data.results._id)
          setSelectedName(reOpenedTickets.data.results.ticketNo)
          setSelectedData(reOpenedTickets.data.results)
          console.log(reOpenedTickets)
          break
        case 'Resolved':
          const resolvedTickets = await api.get(`/api/service-tickets/?serviceStatus=resolved&sort=-createdBy`)
          setDialogTitle('Resolved Tickets')
          setSelectedId(resolvedTickets.data.results._id)
          setSelectedName(resolvedTickets.data.results.ticketNo)
          setSelectedData(resolvedTickets.data.results)
          console.log(resolvedTickets)
          break
        case 'Closed':
          const closedTickets = await api.get(`/api/service-tickets/?serviceStatus=closed&sort=-createdBy`)
          setDialogTitle('Closed Tickets')
          setSelectedId(closedTickets.data.results._id)
          setSelectedName(closedTickets.data.results.ticketNo)
          setSelectedData(closedTickets.data.results)
          console.log(closedTickets)
          break
        default:
          break
      }
    }
    catch(error: any) {
      console.log(error)
    }
    finally {
      setDataListDialog(true)
    }
    
  }


  async function handleTaskTypePopulationClick(data: any) {
    try {
      switch(data.name) {
        case 'Incident':
          const incedentTickets = await api.get(`/api/service-tickets?noPage=true&taskType=incident`)
          setDialogTitle('Incident Tasks')
          setSelectedId(incedentTickets.data._id)
          setSelectedName(incedentTickets.data.ticketNo)
          setSelectedData(incedentTickets.data)
          break
        case 'Service Request':
          const serviceRequestTickets = await api.get(`/api/service-tickets?noPage=true&taskType=service request`)
          setDialogTitle('Service Request Tasks')
          setSelectedId(serviceRequestTickets.data._id)
          setSelectedName(serviceRequestTickets.data.ticketNo)
          setSelectedData(serviceRequestTickets.data)
          break
        case 'Asset Request':
          const assetRequestTickets = await api.get(`/api/service-tickets?noPage=true&taskType=asset request`)
          setDialogTitle('Asset Request Tasks')
          setSelectedId(assetRequestTickets.data._id)
          setSelectedName(assetRequestTickets.data.ticketNo)
          setSelectedData(assetRequestTickets.data)
          break
        case 'Maintenance':
          const maintenanceTickets = await api.get(`/api/service-tickets?noPage=true&taskType=maintenance`)
          setDialogTitle('Maintenance Tasks')
          setSelectedId(maintenanceTickets.data._id)
          setSelectedName(maintenanceTickets.data.ticketNo)
          setSelectedData(maintenanceTickets.data)
          break
        case 'Consultation':
          const consultationTickets = await api.get(`/api/service-tickets?noPage=true&taskType=consultation`)
          setDialogTitle('Consultation Tasks')
          setSelectedId(consultationTickets.data._id)
          setSelectedName(consultationTickets.data.ticketNo)
          setSelectedData(consultationTickets.data)
          break
        case 'Accessibility':
          const accessibilityTickets = await api.get(`/api/service-tickets?noPage=true&taskType=accessibility`)
          setDialogTitle('Accessibility Tasks')
          setSelectedId(accessibilityTickets.data._id)
          setSelectedName(accessibilityTickets.data.ticketNo)
          setSelectedData(accessibilityTickets.data)
          break
        default:
          break
      }
    }
    catch(error: any) {
      console.log(error)
    } 
    finally {
      setDataListDialog(true)
    }
  }

  async function handleEquipmentTypePopulationClick(data: any) {
    try {
      switch(data.name) {
        case 'Computer':
          const computerEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=computer`)
          setDialogTitle('Computer Equipment Type')
          setSelectedId(computerEquipment.data._id)
          setSelectedName(computerEquipment.data.ticketNo)
          setSelectedData(computerEquipment.data)
          break
        case 'Printer':
          const printerEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=printer`)
          setDialogTitle('Printer Equipment Type')
          setSelectedId(printerEquipment.data._id)
          setSelectedName(printerEquipment.data.ticketNo)
          setSelectedData(printerEquipment.data)
          break
        case 'Scanner':
            const scannerEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=scanner`)
            setDialogTitle('Scanner Equipment Type')
            setSelectedId(scannerEquipment.data._id)
            setSelectedName(scannerEquipment.data.ticketNo)
            setSelectedData(scannerEquipment.data)
            break
        case 'Mobile Device':
          const mobileDeviceEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=mobile device`)
          setDialogTitle('Printer Equipment Type')
          setSelectedId(mobileDeviceEquipment.data._id)
          setSelectedName(mobileDeviceEquipment.data.ticketNo)
          setSelectedData(mobileDeviceEquipment.data)
          break
        case 'Network Related':
          const networkRelatedEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=network related`)
          setDialogTitle('Network Related Equipment Type')
          setSelectedId(networkRelatedEquipment.data._id)
          setSelectedName(networkRelatedEquipment.data.ticketNo)
          setSelectedData(networkRelatedEquipment.data)
          break
        case 'Software Application':
          const softwareApplicationEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=software application`)
          setDialogTitle('Software Application Equipment Type')
          setSelectedId(softwareApplicationEquipment.data._id)
          setSelectedName(softwareApplicationEquipment.data.ticketNo)
          setSelectedData(softwareApplicationEquipment.data)
          break
        case 'Others':
          const othersEquipment = await api.get(`/api/service-tickets?noPage=true&equipmentType=software application`)
          setDialogTitle('Others Equipment Type')
          setSelectedId(othersEquipment.data._id)
          setSelectedName(othersEquipment.data.ticketNo)
          setSelectedData(othersEquipment.data)
          break
        default:
          break
      }
    }
    catch(error: any) {
      console.log(error)
    } 
    finally {
      setDataListDialog(true)
    }
  }


  async function handleUserRolePopulationClick(data: any) {
    try {
      switch(data.name) {
        case 'Admin':
          const adminUsers = await api.get(`/api/users?role=admin&noPage=true`)
          setDialogTitle('Admin Roles')
          setSelectedId(adminUsers.data._id)
          setSelectedName(adminUsers.data.lastName)
          setSelectedData(adminUsers.data)
          break
        case 'Service Engineer':
          const staffUsers = await api.get(`/api/users?role=staff&noPage=true`)
          setDialogTitle('Service Engineer Roles')
          setSelectedId(staffUsers.data._id)
          setSelectedName(staffUsers.data.lastName)
          setSelectedData(staffUsers.data)
          break
        case 'Client':
          const userUsers = await api.get(`/api/users?role=user&noPage=true`)
          setDialogTitle('Client Roles')
          setSelectedId(userUsers.data._id)
          setSelectedName(userUsers.data.lastName)
          setSelectedData(userUsers.data)
          break
        default:
          break
      }
    }
    catch(error: any) {
      console.log(error)
    } 
    finally {
      setUserListDialog(true)
    }
  }

  


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
            <div className="text-3xl font-bold">{totalClient || 0 }</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid custom-lg:grid-cols-3 custom-md:grid-cols-2 gap-4">

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">Ticket service status population</CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220} style={{ cursor: 'pointer' }}>
              <BarChart data={serviceStatusesData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#8bb2f0" radius={[0, 0, 0, 0]} onClick={handleServiceStatusPopulationClick} className="cursor-pointer"/>
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
              <BarChart data={taskTypesData} layout="vertical" >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} interval={0} />
                <Tooltip />
                <Bar dataKey="total" fill="#8fc98d" radius={[0, 0, 0, 0]} onClick={handleTaskTypePopulationClick} className="cursor-pointer" />
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
                <Bar dataKey="total" fill="#deb7ab" radius={[0, 0, 0, 0]} onClick={handleEquipmentTypePopulationClick} className="cursor-pointer" />
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
                <Bar dataKey="total" fill="#e8a0e4" radius={[0, 0, 0, 0]} onClick={handleUserRolePopulationClick} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <DataListDialog 
        dialogOpen={dataListDialog}
        setDialogOpen={setDataListDialog}
        title={dialogTitle}
        id={selectedId}
        name={selectedName}
        data={selectedData}
      />
      <UserListDialog 
        dialogOpen={userListDialog}
        setDialogOpen={setUserListDialog}
        title={dialogTitle}
        id={selectedId}
        name={selectedName}
        data={selectedData}
      />

    </section>
  )
}
