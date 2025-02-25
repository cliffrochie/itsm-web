import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import { format } from "date-fns"

import api from '@/hooks/use-api'
import { handleAxiosError } from '@/utils/error-handler'
import { changeDateFormatMMDDYYYY } from '@/utils'

import { useQuery } from '@tanstack/react-query'

import { toast, Slide } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { capitalizeFirstLetter } from '@/utils'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import UserComboBox from '@/features/admin/components/comboboxes/user-combobox'
import ClientComboBox from '@/features/admin/components/comboboxes/client-combobox'

import { IServiceTicket } from '@/@types/service-ticket'
import { cn } from '@/lib/utils'
import { CalendarIcon, Link } from 'lucide-react'
import { generateTicket, getDateFormatYYYYMMDD, timeRegex } from '@/utils'
import { withMask } from 'use-mask-input'
import { taskTypes } from '@/data/task-types'
import { equipmentTypes } from '@/data/equipment-types'
import { serviceStatuses } from '@/data/service-status'
import { priorities } from '@/data/priority'
import { IClient } from '@/@types/client'
import { IUser } from '@/@types/user'



const formSchema = z.object({
  ticketNo: z.string(),
  taskType: z.string({ required_error: 'Task type is required' }).min(1, {message: 'This field is required'}),
  title: z.string({ required_error: 'Title is required' }).min(1, {message: 'This field is required'}),
  natureOfWork: z.string({ required_error: 'Nature of work / problem is required' }).min(1, {message: 'This field is required'}),
  serialNo: z.string(),
  equipmentType: z.string({ required_error: 'Equipment type is required' }).min(1, {message: 'This field is required'}),
  equipmentTypeOthers: z.string(),
  defectsFound: z.string(),
  serviceRendered: z.string(),
  serviceStatus: z.string({ required_error: 'Service status is required' }).min(1, {message: 'This field is required'}),
  priority: z.string({ required_error: 'Priority level is required' }),
  remarks: z.string(),
  serviceEngineer: z.string().nullable(),
  client: z.string().min(1, {message: 'This field is required'}),
})


export default function AdminITServiceTicketForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const currentPath = location.pathname.split('/')
  const [dateString, setDateString] = useState(getDateFormatYYYYMMDD())
  const [timeString, setTimeString] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [previousUser, setPreviousUser] = useState('')
  const [searchClient, setSearchClient] = useState('')
  const [previousClient, setPreviousClient] = useState('')
  const [period, setPeriod] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  let isUpdate = false

  let title = ''
  if(currentPath[currentPath.length-1] === 'create') {
    title = 'Create'
  }
  else if(currentPath[currentPath.length-1] === 'update') {
    title = 'Update'
    isUpdate = true
  }

  const { data } = useQuery({
    queryKey: ['serviceTicketForm'],
    queryFn: async () => {
      let data: IServiceTicket = {
        _id: '',
        ticketNo: '',
        taskType: '',
        title: '',
        natureOfWork: '',
        serialNo: '',
        equipmentType: '',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: '',
        priority: '',
        remarks: '',
        adminRemarks: '',
        serviceEngineer: '',
        client: '',
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


  function removeError(key: string) {
    setErrors((prevErrors) => {
      const { [key]: _, ...updatedErrors } = prevErrors
      return updatedErrors
    })
  }

 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketNo: '',
      taskType: '',
      title: '', 
      natureOfWork: '',
      serialNo: '',
      equipmentType: '',
      equipmentTypeOthers: '',
      defectsFound: '',
      serviceRendered: '',
      serviceStatus: '',
      priority: '',
      remarks: '',
      serviceEngineer: '',
      client: '',
    },
  })


  useEffect(() => {
    if(isUpdate) {

      let client = null
      if(data && data.client) {
        client = data.client as IClient
      }

      let serviceEngineer = null
      if(data && data.serviceEngineer) {
        serviceEngineer = data.serviceEngineer as IUser
      }

      let clientFullName = ''
      if(client) {
        clientFullName = client.firstName 
        clientFullName += client.middleName !== undefined 
          && client.middleName !== null
          && client.middleName !== ''
          && client.middleName.charAt(0) 
          ? ` ${client.middleName.charAt(0)}. ` : ' '
        clientFullName += client.lastName
      }

      let serviceEngineerFullName = ''
      if(serviceEngineer) {
        serviceEngineerFullName = serviceEngineer.firstName
        serviceEngineerFullName += serviceEngineer.middleName !== undefined 
          && serviceEngineer.middleName !== null
          && serviceEngineer.middleName !== ''
          && serviceEngineer.middleName.charAt(0) 
          ? ` ${serviceEngineer.middleName.charAt(0)}. ` : ' '
        serviceEngineerFullName += serviceEngineer.lastName
      }


      setPreviousClient(clientFullName)
      setPreviousUser(serviceEngineerFullName)

      form.setValue('ticketNo', data ? data.ticketNo : '')
      form.setValue('taskType', data ? data.taskType : '')
      form.setValue('equipmentType', data ? data.equipmentType : '')
      form.setValue('title', data ? data.title !== undefined ? data.title : '' : '')
      form.setValue('natureOfWork', data ? data.natureOfWork !== undefined ? data.natureOfWork : '' : '')
      form.setValue('serviceStatus', data ? data.serviceStatus !== undefined ? data.serviceStatus : '' : '')
      form.setValue('priority', data ? data.priority : '')
      form.setValue('defectsFound', data ? data.defectsFound !== undefined ? data.defectsFound : '' : '')
      form.setValue('serviceRendered', data ? data.serviceRendered !== undefined ? data.serviceRendered : '' : '')
      form.setValue('client', client ? client._id : '')
      form.setValue('serviceEngineer', serviceEngineer ? serviceEngineer._id : null)
      
    }
  }, [data, searchClient, searchUser])


  useEffect(() => {
    form.setValue('client', searchClient ? searchClient : '')
  }, [searchClient])

  useEffect(() => {
    form.setValue('serviceEngineer', searchUser ? searchUser: '')
  }, [searchUser])


  async function onSubmit(data: z.infer<typeof formSchema>) {
    const newData = {
      ...data,
    }

    console.log(newData)

    try {
      if(isUpdate) {
        const response = await api.put(`/api/service-tickets/${params.serviceTicketId}`, newData)
        if(response.status === 200) {
          toast.success(`${response.data.ticketNo} is updated successfully.`, {
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

          navigate('/admin/it-service-tickets/')
        } 
      }
      else {
        const response = await api.post('/api/service-tickets/', newData)
        if(response.status === 201) {
          toast.success(`${response.data.ticketNo} is created successfully.`, {
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

          navigate('/admin/it-service-tickets/')
        } 
      }
      
    }
    catch(e: unknown) {
      const err = handleAxiosError(e)
      console.log(err)
    //   let obj: any = {}
    //   obj[err.key] = err.message
    //   console.log(obj)
    //   setErrors(obj)
    }
  }


  function upperCaseText(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue('title', e.target.value.toLocaleUpperCase())
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} IT Service Ticket</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 custom-lg:w-6/12 custom-md:w-7/12 sm:w-full">
            <Label className="text-gray-500">Service Ticket Information</Label>
            <div className="grid">
              <FormField  
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.title ? 'text-red-500' : ''}>Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" placeholder="Title here.." onChange={upperCaseText} />
                    </FormControl>
                    <FormMessage>{ errors?.title }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-1">
              <FormField 
                control={form.control}
                name="taskType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          { isUpdate ? (<SelectValue placeholder={capitalizeFirstLetter(field.value)} />) : (<SelectValue placeholder="Select task type" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskTypes.map((taskType) => (
                          <SelectItem key={taskType.value} value={taskType.value}>{taskType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          { isUpdate ? (<SelectValue placeholder={capitalizeFirstLetter(field.value)} />) : (<SelectValue placeholder="Select equipment type" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentTypes.map((equipmentType) => (
                          <SelectItem key={equipmentType.value} value={equipmentType.value}>{equipmentType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="serviceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.serviceStatus ? 'text-red-500' : ''}>Service Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          { isUpdate ? (<SelectValue placeholder={capitalizeFirstLetter(field.value)} />) : (<SelectValue placeholder="Select service status" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceStatuses.map((serviceStatus) => (
                          <SelectItem key={serviceStatus.value} value={serviceStatus.value}>{serviceStatus.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          { isUpdate ? (<SelectValue placeholder={capitalizeFirstLetter(field.value)} />) : (<SelectValue placeholder="Select priority level" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid">
              <FormField
                control={form.control}
                name="natureOfWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Work / Problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your query here.."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a comprehensive information but concise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
            <FormField  
                control={form.control}
                name="defectsFound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.defectsFound ? 'text-red-500' : ''}>Defects Found</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the defects.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{ errors?.defectsFound }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField  
                control={form.control}
                name="serviceRendered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.serviceRendered ? 'text-red-500' : ''}>Service Rendered</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your actions.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{ errors?.serviceRendered }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <FormField  
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.client ? 'text-red-500' : ''}>Client</FormLabel>
                    <FormControl>
                      <ClientComboBox className="h-7" defaultValue={searchClient} previousValue={previousClient} onValueChange={(value: string) => {
                        setSearchClient(value)
                      }} />
                    </FormControl>
                    <FormMessage>{ errors?.client }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField  
                control={form.control}
                name="serviceEngineer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.serviceEngineer ? 'text-red-500' : ''}>Service Engineer</FormLabel>
                    <FormControl>
                      <UserComboBox className="h-7" defaultValue={searchUser} previousValue={previousUser} onValueChange={(value: string) => {
                        setSearchUser(value)
                      }} />
                    </FormControl>
                    <FormMessage>{ errors?.serviceEngineer }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid">
              <FormField  
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.remarks ? 'text-red-500' : ''}>Remarks</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" placeholder="Remarks / other helpful information.." />
                    </FormControl>
                    <FormMessage>{ errors?.remarks }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="bg-blue-500">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  )
}