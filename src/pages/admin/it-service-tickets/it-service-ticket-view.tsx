import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IServiceTicket } from '@/@types/service-ticket'
import api from '@/services/use-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Circle } from 'lucide-react'
import { priorities } from '@/data/priority'
import { serviceStatuses } from '@/data/service-status'
import { taskTypes } from '@/data/task-types'
import { equipmentTypes } from '@/data/equipment-types'
import { IClient } from '@/@types/client'
import { capitalizeFirstLetter } from '@/utils'
import { IUser } from '@/@types/user'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IServiceTicketHistory } from '@/@types/service-ticket-history'
import UpdateStatusDialog from '@/features/admin/components/dialogs/it-service-tickets/update-status-dialog'
import AssignServiceEngineerDialog from '@/features/admin/components/dialogs/it-service-tickets/assign-service-engineer-dialog'
import EscalateServiceDialog from '@/features/admin/components/dialogs/it-service-tickets/escalate-service-dialog'
import { Slide, toast } from 'react-toastify'



export default function ITServiceTicketView() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()

  const [clientFullName, setClientFullName] = useState('')
  const [userFullName, setUserFullName] = useState('')
  const [serviceEngineerId, setServiceEngineerId] = useState('')
  const [officeName, setOfficeName] = useState('')
  const [PriorityIcon, setPriorityIcon] = useState<LucideIcon>(() => Circle)
  const [ServiceStatusIcon, setServiceStatusIcon] = useState<LucideIcon>(() => Circle)
  const [TaskTypeIcon, setTaskTypeIcon] = useState<LucideIcon>(() => Circle)
  const [EquipmentTypeIcon, setEquipmentTypeIcon] = useState<LucideIcon>(() => Circle)
  const [updateServiceStatusDialogOpen, setUpdateServiceStatusDialogOpen] = useState(false)
  const [assignServiceEngineerDialogOpen, setAssignServiceEngineerDialogOpen] = useState(false)
  const [escalateServiceDialogOpen, setEscalateServiceDialogOpen] = useState(false)
  

  const dataQuery = useQuery({
    queryKey: ['serviceTicketView'],
    queryFn: async () => {
      let data: IServiceTicket = {
        _id: '',
        ticketNo: '',
        date: '',
        time: '',
        taskType: '',
        natureOfWork: '',
        serialNo: '',
        equipmentType: '',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: '',
        priority: '',
        remarks: '',
        serviceEngineer: null,
        client: null,
      }
      let url = `/api/service-tickets/${params.serviceTicketId}/?includes=all`
      if(params.serviceTicketId) {
        await api.get(url).then(response => {
          data = response.data
        })
      }
      return data
    }
  }) 

  const serviceTicketHistoryQuery = useQuery({
    queryKey: ['serviceTicketHistory', dataQuery.data],
    queryFn: async () => {
      let result: IServiceTicketHistory[] = []
      if(dataQuery.data) {
        let url = `/api/service-ticket-histories/?noPage=true&sort=-createdAt&serviceTicket=${dataQuery.data._id ? dataQuery.data._id : undefined}`
        await api.get(url).then(response => {
          result = response.data
        })
      }
      return result
    }
  })

  const updateStatusDialogMutation = useMutation({
    mutationKey: ['updateServiceStatusDialogMutation'],
    mutationFn: async(data: string) => {
      const parsedData = JSON.parse(data)
      return await api.patch(`/api/service-tickets/${parsedData.id}/update-service-status`, {serviceStatus: parsedData.serviceStatus})
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTicketView'] })
      toast.success(`IT Service status updated successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: 'text-sm',
      });
    }
  })

  const assignServiceEngineerDialogMutation = useMutation({
    mutationKey: ['assignServiceEngineerDialogMutation'],
    mutationFn: async(data: string) => {
      const parsedData = JSON.parse(data)
      const body = {
        serviceEngineer: parsedData.serviceEngineer,
        priority: parsedData.priority,
        adminRemarks: parsedData.adminRemarks
      }
      return await api.patch(`/api/service-tickets/${parsedData.id}/assign-service-engineer`, body)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTicketView'] })
      toast.success(`Service Engineer assigned successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: 'text-sm',
      });
    }
  })

  const escalateServiceDialogMutation = useMutation({
    mutationKey: ['escalateServiceDialogMutation'],
    mutationFn: async(data: string) => {
      console.log(data)
      const parsedData = JSON.parse(data)
      const body = {
        serviceEngineer: parsedData.serviceEngineer,
        priority: parsedData.priority,
        adminRemarks: parsedData.adminRemarks
      } 
      return await api.patch(`/api/service-tickets/${parsedData.id}/escalate-service`, body)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTicketView'] })
      toast.success(`IT Service is escalated successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: 'text-sm',
      });
    }
  })

  

  useEffect(() => {
    if(dataQuery.data?.priority) {
      const obj = priorities.find(p => p.value === dataQuery.data?.priority)
      if(obj) {
        setPriorityIcon(() => obj.icon)
      }
    }

    if(dataQuery.data?.serviceStatus) {
      const obj = serviceStatuses.find(s => s.value == dataQuery.data?.serviceStatus)
      if(obj) {
        setServiceStatusIcon(() => obj.icon)
      }
    }

    if(dataQuery.data?.taskType) {
      const obj = taskTypes.find(t => t.value === dataQuery.data.taskType)
      if(obj) {
        setTaskTypeIcon(() => obj.icon)
      }
    }

    if(dataQuery.data?.equipmentType) {
      const obj = equipmentTypes.find(e => e.value === dataQuery.data.equipmentType)
      if(obj) {
        setEquipmentTypeIcon(() => obj.icon)
      }
    }

    if(dataQuery.data?.client) {
      const obj = dataQuery.data.client as IClient
      setClientFullName(`${capitalizeFirstLetter(obj.firstName)} 
        ${obj.middleName ? String(capitalizeFirstLetter(obj.middleName)).charAt(0)+'.' : ''} 
        ${capitalizeFirstLetter(obj.lastName)} 
        ${obj.extensionName ? String(capitalizeFirstLetter(obj.extensionName)) : ''}`)

      api.get(`/api/offices/${obj.office}`)
        .then(response => {
          setOfficeName(response.data.name)
        })
    }

    if(dataQuery.data?.serviceEngineer) {
      const obj = dataQuery.data.serviceEngineer as IUser
      setServiceEngineerId(obj._id)
      setUserFullName(`${capitalizeFirstLetter(obj.firstName)} 
        ${obj.middleName ? String(capitalizeFirstLetter(obj.middleName)).charAt(0)+'.' : ''} 
        ${capitalizeFirstLetter(obj.lastName)}`)
    }

  }, [dataQuery.data])


  return (
    <section>
      <h3 className="text-xl font-semibold">Ticket No: &nbsp;&nbsp;<span className="font-mono font-normal">{dataQuery.data?.ticketNo}</span></h3>
      <div className="mt-5 mb-5 flex justify-start items-center gap-4">
        <div>Actions:</div>
        <Button variant="outline" type="submit" onClick={() => {
          setUpdateServiceStatusDialogOpen(true)
        }}>Update Service Status</Button>

        {dataQuery.data && dataQuery.data.serviceEngineer === null && (
          <Button variant="outline" type="submit" onClick={() => {
            setAssignServiceEngineerDialogOpen(true)
          }}>
            Assign Service Engineer
          </Button>
        )}
        {dataQuery.data && dataQuery.data.serviceEngineer !== null && (
          <Button variant="outline" type="submit" onClick={() => {
            setEscalateServiceDialogOpen(true)
          }}>
            Escalate Service
          </Button>
        )}
      </div>
      <div className="grid gap-4 custom-xl:grid-cols-[400px,400px,auto] custom-lg:grid-cols-2 custom-md:grid-cols-1 ">
      {/* <div className="grid gap-4 lg:grid-cols-[400px,auto,auto] md:grid-cols-1"> */}
      {/* <div className="flex w-full justify-stretch gap-4 flex-wrap"> */}
        <Card className="w-full h-[480px]">
          <CardHeader>
            <CardTitle>IT Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Date Requested:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className="text-sm">{ dataQuery.data ? String(dataQuery.data.date) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Time Requested:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className="text-sm">{ dataQuery.data ? dataQuery.data.time : '' }</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Priority Level:</div>
                  <div className="font-bold flex justify-between gap-2">
                    {dataQuery.data && dataQuery.data.priority && (<PriorityIcon size={16} />)} 
                    <span className="text-sm">{dataQuery.data && dataQuery.data.priority ? capitalizeFirstLetter(dataQuery.data.priority) : 'None'}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Current Service Status:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <ServiceStatusIcon size={16} /> 
                    <span className="text-sm">{dataQuery.data ? capitalizeFirstLetter(String(dataQuery.data.serviceStatus)) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Type:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <TaskTypeIcon size={16} /> 
                    <span className="text-sm">{dataQuery.data ? capitalizeFirstLetter(dataQuery.data.taskType) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Equipment:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <EquipmentTypeIcon size={16} /> 
                    <span className="text-sm">{dataQuery.data ? capitalizeFirstLetter(dataQuery.data.equipmentType) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Service Engineer:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className={ userFullName ? "text-sm" : "text-sm text-red-500" }>{ userFullName ? userFullName : 'Unassigned' }</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="custom-lg:w-full w-auto h-[480px]">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 items-stretch h-full ">
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Nature of Work / Problem</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {dataQuery.data ? dataQuery.data.natureOfWork : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Findings</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {dataQuery.data ? dataQuery.data.defectsFound : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Service Rendered</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {dataQuery.data ? dataQuery.data.serviceRendered : ''}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Requestor Name:</span>
                <span className="font-bold text-sm">{clientFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Requestor Office:</span>
                <span className="font-bold text-sm">{officeName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="custom-xl:col-span-1 custom-lg:col-span-2 custom-sm:col-span-1 h-[480px] overflow-hidden">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto overflow-x-auto">
            <div className="grid grid-cols-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTicketHistoryQuery.data && serviceTicketHistoryQuery.data.map((history) => (
                    <TableRow key={history._id}>
                      <TableCell>{history.date}</TableCell>
                      <TableCell>{history.time}</TableCell>
                      <TableCell>{history.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <UpdateStatusDialog 
          dialogOpen={updateServiceStatusDialogOpen} 
          setDialogOpen={setUpdateServiceStatusDialogOpen} 
          id={dataQuery.data && dataQuery.data._id ? dataQuery.data._id : ''} 
          name={dataQuery.data ? dataQuery.data.ticketNo : ''}
          selectedServiceStatus={dataQuery.data ? dataQuery.data.serviceStatus : ''}
          updateMutation={updateStatusDialogMutation}
        />
        <AssignServiceEngineerDialog 
          dialogOpen={assignServiceEngineerDialogOpen}
          setDialogOpen={setAssignServiceEngineerDialogOpen}
          id={dataQuery.data && dataQuery.data._id ? dataQuery.data._id : ''} 
          name={dataQuery.data ? dataQuery.data.ticketNo : ''}
          updateMutation={assignServiceEngineerDialogMutation}
        />
        <EscalateServiceDialog 
          dialogOpen={escalateServiceDialogOpen}
          setDialogOpen={setEscalateServiceDialogOpen}
          id={dataQuery.data && dataQuery.data._id ? dataQuery.data._id : ''} 
          name={dataQuery.data ? dataQuery.data.ticketNo : ''}
          currentServiceEngineer={userFullName}
          currentPriorityLevel={dataQuery.data ? dataQuery.data.priority : ''}
          excludeUser={serviceEngineerId}
          updateMutation={escalateServiceDialogMutation}
        />
      </div>
    </section>
  )
}
