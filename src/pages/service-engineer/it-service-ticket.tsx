import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IServiceTicket } from "@/@types/service-ticket"
import { IClient, isClientInterface } from "@/@types/client"
import { isUserInterface } from '@/@types/user'
import { taskTypes } from "@/data/task-types"
import { equipmentTypes } from "@/data/equipment-types"
import { priorities } from "@/data/priority"
import { serviceStatuses } from "@/data/service-status"
import { capitalizeFirstLetter } from "@/utils"

import api from "@/hooks/use-api"
import { useNavigate, useParams } from "react-router-dom"
import { Suspense, useEffect, useMemo, useState } from "react"
import { Circle, LucideIcon } from "lucide-react"
import InputFindingsDialog from "@/features/it-service-ticket/dialogs/input-findings-dialog"
import { Slide, toast } from "react-toastify"


export default function ServiceEngineerITServiceTicket() {
  const [dateRequested, setDateRequested] = useState('')
  const [inputFindingsDialogOpen, setInputFindingsDialogOpen] = useState(false)
  const [serviceTicket, setServiceTicket] = useState<IServiceTicket | undefined>(undefined)
  const [userFullName, setUserFullName] = useState('')
  const [clientFullName, setClientFullName] = useState('')
  const [officeName, setOfficeName] = useState('')
  const [PriorityIcon, setPriorityIcon] = useState<LucideIcon>(() => Circle)
  const [ServiceStatusIcon, setServiceStatusIcon] = useState<LucideIcon>(() => Circle)
  const [TaskTypeIcon, setTaskTypeIcon] = useState<LucideIcon>(() => Circle)
  const [EquipmentTypeIcon, setEquipmentTypeIcon] = useState<LucideIcon>(() => Circle)

  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()
  const defaultData = useMemo(() => [], [])
  const queryKey = ['assignedTicket']

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let url = `/api/service-tickets/?ticketNo=${params.ticketNo}&includes=all`
      await api.get(url).then(response => {
        if(response.data.results.length > 0) {
          setServiceTicket(response.data.results[0])
          return 1
        }
      })
      return 0
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    if(serviceTicket && serviceTicket.createdAt) {
      const result = new Date(serviceTicket.createdAt)
      const formattedDate = result.toLocaleDateString('en-US', { 
          timeZone: "Asia/Singapore",
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true // Set to false for 24-hour format
      });
      setDateRequested(formattedDate)
    }

    if(serviceTicket && serviceTicket.priority) {
      const obj = priorities.find(p => p.value === serviceTicket?.priority)
      if(obj) {
        setPriorityIcon(() => obj.icon)
      }
    }

    if(serviceTicket?.serviceStatus) {
      const obj = serviceStatuses.find(s => s.value == serviceTicket?.serviceStatus)
      if(obj) {
        setServiceStatusIcon(() => obj.icon)
      }
    }

    if(serviceTicket?.taskType) {
      const obj = taskTypes.find(t => t.value === serviceTicket.taskType)
      if(obj) {
        setTaskTypeIcon(() => obj.icon)
      }
    }

    if(serviceTicket?.equipmentType) {
      const obj = equipmentTypes.find(e => e.value === serviceTicket.equipmentType)
      if(obj) {
        setEquipmentTypeIcon(() => obj.icon)
      }
    }

    if(serviceTicket?.client) {
      const obj = serviceTicket.client as IClient
      setClientFullName(`${capitalizeFirstLetter(obj.firstName)} 
        ${obj.middleName ? String(capitalizeFirstLetter(obj.middleName)).charAt(0)+'.' : ''} 
        ${capitalizeFirstLetter(obj.lastName)} 
        ${obj.extensionName ? String(capitalizeFirstLetter(obj.extensionName)) : ''}`)

      api.get(`/api/offices/${obj.office}`)
        .then(response => {
          if(response.status === 200) {
            setOfficeName(response.data.name)
          }
        })
    }

  }, [serviceTicket])


  const inputFindingsDialogMutation = useMutation({
    mutationKey: ['inputFindingsDialogMutation'],
    mutationFn: async(data: string) => {
      console.log(data)
      const parsedData = JSON.parse(data)
      const body = {
        findings: parsedData.findings
      } 
      return await api.patch(`/api/service-tickets/${parsedData.id}/input-findings`, body)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['assignedTicket'] })
      toast.success(`Findings inputted successfully.`, {
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
  
  return (
    <section className="grid custom-md:grid-cols-1 gap-4">
      <div className="">
        <h3 className="text-xl font-semibold">Ticket No: &nbsp;&nbsp;<span className="font-mono font-normal">{params.ticketNo}</span></h3>
      </div>
      <div className="grid gap-4 custom-xl:grid-cols-[400px,400px,auto] custom-lg:grid-cols-2 custom-md:grid-cols-1 ">
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
                    <span className="text-sm">{dateRequested}</span>
                  </div>
                </div>
                <hr/>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Priority Level:</div>
                  <div className="font-bold flex justify-between gap-2">
                    {serviceTicket && serviceTicket.priority && (<PriorityIcon size={16} />)} 
                    <span className="text-sm">{serviceTicket && serviceTicket.priority ? capitalizeFirstLetter(serviceTicket.priority) : 'None'}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Current Service Status:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <ServiceStatusIcon size={16} /> 
                    <span className="text-sm">{serviceTicket ? capitalizeFirstLetter(String(serviceTicket.serviceStatus)) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Type:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <TaskTypeIcon size={16} /> 
                    <span className="text-sm">{serviceTicket ? capitalizeFirstLetter(serviceTicket.taskType) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Equipment:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <EquipmentTypeIcon size={16} /> 
                    <span className="text-sm">{serviceTicket ? capitalizeFirstLetter(serviceTicket.equipmentType) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Requestor Name:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className={ clientFullName ? "text-sm" : "text-sm text-red-500" }>{ clientFullName ? clientFullName : 'Unassigned' }</span>
                  </div>
                  {/* <div className="font-bold flex justify-between gap-2">
                    <span className={ userFullName ? "text-sm" : "text-sm text-red-500" }>{ userFullName ? userFullName : 'Unassigned' }</span>
                  </div> */}
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Requestor Office:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className={ officeName ? "text-sm" : "text-sm text-red-500" }>{ officeName ? officeName : 'Unassigned' }</span>
                  </div>
                  {/* <div className="font-bold flex justify-between gap-2">
                    <span className={ userFullName ? "text-sm" : "text-sm text-red-500" }>{ userFullName ? userFullName : 'Unassigned' }</span>
                  </div> */}
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
            <div className="grid gap-3 items-stretch h-full ">
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Nature of Work / Problem</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {serviceTicket ? serviceTicket.natureOfWork : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Finding <span className="text-xs">(click the box below)</span></span> 
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm cursor-pointer" onClick={() => setInputFindingsDialogOpen(true) }>
                  {serviceTicket ? serviceTicket.defectsFound : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Service Rendered</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {serviceTicket ? serviceTicket.serviceRendered : ''}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 font-semibold">Service Engineer:</span>
                <span  className={ officeName ? "text-sm" : "text-sm text-red-500 font-bold" }>{userFullName ? userFullName : 'Unassigned'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      <InputFindingsDialog 
        dialogOpen={inputFindingsDialogOpen}
        setDialogOpen={setInputFindingsDialogOpen}
        id={serviceTicket ? serviceTicket._id : ''} 
        currentValue={serviceTicket ? serviceTicket.defectsFound : ''}
        name={serviceTicket ? serviceTicket.ticketNo : ''}
        updateMutation={inputFindingsDialogMutation}
      />
    </section>
  )

}
