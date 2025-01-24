import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"
import { useQuery } from '@tanstack/react-query'
import { IServiceTicket } from '@/@types/service-ticket'
import api from '@/services/use-api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import UserComboBox from '@/features/admin/components/user-combobox'
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function ITServiceTicketView() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  const [searchUser, setSearchUser] = useState('')
  const [previousUser, setPreviousUser] = useState('')
  const [clientFullName, setClientFullName] = useState('')
  const [userFullName, setUserFullName] = useState('')
  const [officeName, setOfficeName] = useState('')
  const [PriorityIcon, setPriorityIcon] = useState<LucideIcon>(() => Circle)
  const [ServiceStatusIcon, setServiceStatusIcon] = useState<LucideIcon>(() => Circle)
  const [TaskTypeIcon, setTaskTypeIcon] = useState<LucideIcon>(() => Circle)
  const [EquipmentTypeIcon, setEquipmentTypeIcon] = useState<LucideIcon>(() => Circle)


  const { data } = useQuery({
    queryKey: ['serviceTicketForm'],
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

  console.log(data)

  useEffect(() => {
    if(data?.priority) {
      const obj = priorities.find(p => p.value === data?.priority)
      if(obj) {
        setPriorityIcon(() => obj.icon)
      }
    }

    if(data?.serviceStatus) {
      const obj = serviceStatuses.find(s => s.value == data?.serviceStatus)
      if(obj) {
        setServiceStatusIcon(() => obj.icon)
      }
    }

    if(data?.taskType) {
      const obj = taskTypes.find(t => t.value === data.taskType)
      if(obj) {
        setTaskTypeIcon(() => obj.icon)
      }
    }

    if(data?.equipmentType) {
      const obj = equipmentTypes.find(e => e.value === data.equipmentType)
      if(obj) {
        setEquipmentTypeIcon(() => obj.icon)
      }
    }

    if(data?.client) {
      const obj = data.client as IClient
      setClientFullName(`${capitalizeFirstLetter(obj.firstName)} 
        ${obj.middleName ? String(capitalizeFirstLetter(obj.middleName)).charAt(0)+'.' : ''} 
        ${capitalizeFirstLetter(obj.lastName)} 
        ${obj.extensionName ? String(capitalizeFirstLetter(obj.extensionName)) : ''}`)

      api.get(`/api/offices/${obj.office}`)
        .then(response => {
          setOfficeName(response.data.name)
        })
    }

    if(data?.serviceEngineer) {
      const obj = data.serviceEngineer as IUser
      setUserFullName(`${capitalizeFirstLetter(obj.firstName)} 
        ${obj.middleName ? String(capitalizeFirstLetter(obj.middleName)).charAt(0)+'.' : ''} 
        ${capitalizeFirstLetter(obj.lastName)}`)
    }

  }, [data])




  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV008",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV009",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV010",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV011",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV012",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV013",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV014",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]

  const history = [
    {
      _id: '1',
      serviceTicket: '1234123',
      serviceStatus: 'open',
      date: '',
      time: '',
      action: 'Assigned to Angelito S. Pajarillo',
      duration: '',
      remarks: '',
      createdAt: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date())
    },
    {
      _id: '2',
      serviceTicket: '1234123',
      serviceStatus: 'open',
      date: '',
      time: '',
      action: '',
      duration: '',
      remarks: '',
      createdAt: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date())
    },
    {
      _id: '3',
      serviceTicket: '1234123',
      serviceStatus: 'open',
      date: '',
      time: '',
      action: '',
      duration: '',
      remarks: '',
      createdAt: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date())
    },
  ]


  return (
    <section>
      <h3 className="text-xl font-semibold">Ticket No: &nbsp;&nbsp;<span className="font-mono font-normal">{data?.ticketNo}</span></h3>
      <div className="mt-5 mb-5 flex justify-start items-center gap-4">
        <div>Actions:</div>
        <Button variant="outline">Escalate</Button>
        <Button variant="outline">Assign Service Engineer</Button>
        <Button variant="outline">Update Status</Button>
      </div>
      <div className="grid gap-4 custom-xl:grid-cols-[400px,auto,auto] custom-lg:grid-cols-2 custom-md:grid-cols-1 ">
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
                    <span className="text-sm">{ data ? String(data.date) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Time Requested:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <span className="text-sm">{ data ? data.time : '' }</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Priority Level:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <PriorityIcon size={16} /> 
                    <span className="text-sm">{data ? capitalizeFirstLetter(data.priority) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Current Service Status:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <ServiceStatusIcon size={16} /> 
                    <span className="text-sm">{data ? capitalizeFirstLetter(String(data.serviceStatus)) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Type:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <TaskTypeIcon size={16} /> 
                    <span className="text-sm">{data ? capitalizeFirstLetter(data.taskType) : ''}</span>
                  </div>
                </div>
                <hr/>
                <div className="flex gap-4 justify-between">
                  <div className="text-sm">Equipment:</div>
                  <div className="font-bold flex justify-between gap-2">
                    <EquipmentTypeIcon size={16} /> 
                    <span className="text-sm">{data ? capitalizeFirstLetter(data.equipmentType) : ''}</span>
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
                  {data ? data.natureOfWork : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Findings</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {data ? data.natureOfWork : ''}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm text-gray-500 font-semibold">Service Rendered</span>
                <div className="border p-3 min-h-20 h-auto rounded-md text-sm">
                  {data ? data.natureOfWork : ''}
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
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </section>
  )
}
