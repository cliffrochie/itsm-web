import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"

import api from '@/services/use-api'
import { handleAxiosError } from '@/utils/error-handler'

import { useQuery } from '@tanstack/react-query'

import { toast, Slide } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { IServiceTicket } from '@/@types/service-ticket'


const formSchema = z.object({
  ticketNo: z.string(),
  date: z.string(),
  time: z.string(),
  taskType: z.string(),
  natureOfWork: z.string(),
  serialNo: z.string(),
  equipmentType: z.string(),
  equipmentTypeOthers: z.string(),
  defectsFound: z.string(),
  serviceRendered: z.string(),
  serviceStatus: z.string(),
  isActive: z.boolean(),
  isFinished: z.boolean(),
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
  const [errors, setErrors] = useState<any>(null)

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
    queryKey: ['designationForm'],
    queryFn: async () => {
      let data: IServiceTicket = {
        _id: '',
        ticketNo: '',
        date: '',
        time: '',
        taskType: 'incident',
        natureOfWork: '',
        serialNo: '',
        equipmentType: 'computer',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: 'open',
        isActive: true,
        isFinished: false,
        priority: 'low',
        remarks: '',
        serviceEngineer: '',
        client: '',
      }
      let url = `/api/designations/${params.designationId}`
      if(params.designationId) {
        await api.get(url).then(response => {
          data = response.data
        })
      }
      return data
    }
  }) 

  useEffect(() => {
    if(isUpdate) {
      // form.setValue('title', data ? data.title : '')
    }
  }, [data])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ticketNo: '',
        date: '',
        time: '',
        taskType: 'incident',
        natureOfWork: '',
        serialNo: '',
        equipmentType: 'computer',
        equipmentTypeOthers: '',
        defectsFound: '',
        serviceRendered: '',
        serviceStatus: 'open',
        isActive: true,
        isFinished: false,
        priority: 'low',
        remarks: '',
        serviceEngineer: '',
        client: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log(data)
    try {
      // if(isUpdate) {
      //   const response = await api.put(`/api/designations/${params.designationId}`, data)
      //   if(response.status === 200) {
      //     toast.success(`${data.title} is updated successfully.`, {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: false,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //       transition: Slide,
      //     });
  
      //     navigate('/admin/designations')
      //   }
      //   else {
      //     console.log(response.status)
      //   }
      // }
      // else {
      //   const response = await api.post('/api/designations', data)
      //   if(response.status === 201) {
      //     toast.success(`${data.title} is created successfully.`, {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: false,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "light",
      //       transition: Slide,
      //     });

      //     navigate('/admin/designations')
      //   }
      //   else {
      //     console.log(response.status)
      //   }
      // }
    }
    catch(e) {
      const err = await handleAxiosError(e)
      let obj: any = {}
      obj[err.key] = err.message
      setErrors(obj)
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} Designation</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-4/12 md:w-7/12 sm:w-full">
            <Label className="text-gray-500">Designation Information</Label>
            <div className="grid gap-4">
              <FormField  
                control={form.control}
                name="ticketNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.ticketNo ? 'text-red-500' : ''}>Ticket Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.ticketNo }</FormMessage>
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