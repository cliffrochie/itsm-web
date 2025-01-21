import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import { format } from "date-fns"

import api from '@/services/use-api'
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


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import UserComboBox from '@/features/admin/components/user-combobox'
import ClientComboBox from '@/features/admin/components/client-combobox'

import { IServiceTicket } from '@/@types/service-ticket'
import { cn } from '@/lib/utils'
import { CalendarIcon, Link } from 'lucide-react'
import { generateTicket, getDateFormatYYYYMMDD, timeRegex } from '@/utils'
import { withMask } from 'use-mask-input'
import { taskTypes } from '@/data/task-types'
import { equipmentTypes } from '@/data/equipment-types'
import { serviceStatuses } from '@/data/service-status'
import { priorities } from '@/data/priority'



const formSchema = z.object({
  ticketNo: z.string(),
  date: z.date(),
  time: z.string(),
  taskType: z.string(),
  natureOfWork: z.string(),
  serialNo: z.string(),
  equipmentType: z.string(),
  equipmentTypeOthers: z.string(),
  defectsFound: z.string(),
  serviceRendered: z.string(),
  serviceStatus: z.string(),
  priority: z.string(),
  remarks: z.string(),
  serviceEngineer: z.string(),
  client: z.string(),
})


export default function AdminITServiceTicketForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const currentPath = location.pathname.split('/')
  const [dateString, setDateString] = useState(getDateFormatYYYYMMDD())
  const [timeString, setTimeString] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [previousUser, setPreviousDesignation] = useState('')
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
    queryKey: ['serviceTicket'],
    queryFn: async () => {
      let data: IServiceTicket = {
        _id: '',
        ticketNo: '',
        date: undefined,
        time: '',
        taskType: '',
        natureOfWork: '',
        serialNo: '',
        equipmentType: '',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: 'open',
        priority: 'low',
        remarks: '',
        serviceEngineer: '',
        client: '',
      }
      let url = `/api/service-tickets/${params.serviceTicketId}`
      if(params.designationId) {
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

  function handleTimeValidation() {
    if(timeRegex.test(form.getValues('time'))) {
      removeError('time')
    }
    else {
      form.setValue('time', '')
      setErrors({ time: 'Invalid time format.' })
    }
  }

 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ticketNo:  !isUpdate ? generateTicket() : '',
        date: !isUpdate ? new Date(): undefined,
        time: '',
        taskType: 'incident',
        natureOfWork: '',
        serialNo: '',
        equipmentType: 'computer',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: 'open',
        priority: 'low',
        remarks: '',
        serviceEngineer: '',
        client: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const newData = {
      ...data,
      time: data.time ? data.time +' '+ period : '',
      date: changeDateFormatMMDDYYYY(data.date),
      serviceEngineer: searchUser,
      client: searchClient
    }

    console.log(newData)

    try {
      if(isUpdate) {

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
    catch(e) {
      const err = await handleAxiosError(e)
      let obj: any = {}
      obj[err.key] = err.message
      setErrors(obj)
    }
  }


  useEffect(() => {
    if(isUpdate) {
      // form.setValue('title', data ? data.title : '')
    }
  }, [data])

  // useEffect(() => {
  //   handleTimeValidation()
  // }, [form.getValues('time')])


  return (
    <section>
      <h3 className="text-xl font-semibold">{title} IT Service Ticket</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-6/12 md:w-7/12 sm:w-full">
            <Label className="text-gray-500">Service Ticket Information</Label>
            <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
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
                          { isUpdate ? (<SelectValue placeholder={field.value.charAt(0).toUpperCase() +  field.value.slice(1)} />) : (<SelectValue placeholder="Select task type" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskTypes.map((taskType) => (
                          <SelectItem key={taskType.value} value={taskType.value}>{taskType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          { isUpdate ? (<SelectValue placeholder={field.value.charAt(0).toUpperCase() +  field.value.slice(1)} />) : (<SelectValue placeholder="Select equipment type" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentTypes.map((equipmentType) => (
                          <SelectItem key={equipmentType.value} value={equipmentType.value}>{equipmentType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
              <div className="grid gap-1 lg:grid-cols-[auto,100px] md:grid-cols-2">
                <FormField  
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={ errors?.time ? 'text-red-500' : ''}>Time</FormLabel>
                      <FormControl>
                        <Input {...field}  ref={withMask('99:99')} className="h-7" onBlur={handleTimeValidation} />
                      </FormControl>
                      <FormMessage>{ errors?.time }</FormMessage>
                    </FormItem>
                  )}
                />
                <Select onValueChange={(value) => setPeriod(value) }>
                  <SelectTrigger className="mt-8 h-7">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Period</SelectLabel>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <FormField  
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.date ? 'text-red-500' : ''}>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-7",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MM/dd/yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{ errors?.date }</FormMessage>
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
                name="serviceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          { isUpdate ? (<SelectValue placeholder={field.value.charAt(0).toUpperCase() +  field.value.slice(1)} />) : (<SelectValue placeholder="Select service status" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceStatuses.map((serviceStatus) => (
                          <SelectItem key={serviceStatus.value} value={serviceStatus.value}>{serviceStatus.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          { isUpdate ? (<SelectValue placeholder={field.value.charAt(0).toUpperCase() +  field.value.slice(1)} />) : (<SelectValue placeholder="Select equipment type" />)}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Client</span>
                <ClientComboBox defaultValue={searchClient} previousValue={previousClient} onValueChange={(value: string) => {
                  setSearchClient(value)
                }} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Service Engineer</span>
                <UserComboBox defaultValue={searchUser} previousValue={previousUser} onValueChange={(value: string) => {
                  setSearchUser(value)
                }} />
              </div>
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