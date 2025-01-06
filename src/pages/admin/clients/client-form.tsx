import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Check, ChevronsUpDown } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import api from '@/services/use-api'
import { handleAxiosError } from '@/utils/error-handler'
import DesignationComboBox from '@/features/admin/components/designation-combobox'
import OfficeComboBox from '@/features/admin/components/office-combobox'

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






const formSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }).min(2),
  middleName: z.string(),
  lastName: z.string({ required_error: 'Last name is required' }).min(2),
  extensionName: z.string(),
  designation: z.string(),
  office: z.string(),
})


export default function AdminClientForm() {
  const location = useLocation()
  const currentPath = location.pathname.split('/')
  let title = ''
  if(currentPath[currentPath.length-1] === 'create') {
    title = 'Create'
  }
  else if(currentPath[currentPath.length-1] === 'update') {
    title = 'Update'
  }

  const [searchDesignation, setSearchDesignation] = useState('')
  const [searchOffice, setSearchOffice] = useState('')
  const [errors, setErrors] = useState<any>(null)
  
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      designation: '',
      office: ''
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const newData: z.infer<typeof formSchema> = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      extensionName: data.extensionName,
      designation: searchDesignation,
      office: searchOffice
    }

    try {
      const response = await api.post('/api/clients', newData)
      if(response.status === 201) {
        toast.success(`"${data.firstName} ${data.lastName}" is created successfully.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });

        navigate('/admin/clients')
      }
      else {
        console.log(response.status)
      }
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
      <h3 className="text-xl font-semibold">{title} Client</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-9/12 sm:w-full">
            <Label className="text-gray-500">Client Information</Label>
            <div className="grid lg:grid-cols-4 md:grid-cols-1 gap-4">
              <FormField  
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.firstName ? 'text-red-500' : ''}>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.firstName }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField  
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.middleName ? 'text-red-500' : ''}>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.middleName }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField  
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.lastName ? 'text-red-500' : ''}>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.lastName }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField  
                control={form.control}
                name="extensionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.extensionName ? 'text-red-500' : ''}>Extension Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.extensionName }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm">Designation</span>
                <DesignationComboBox defaultValue={searchDesignation} onValueChange={(value: string) => {
                  setSearchDesignation(value)
                }} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm">Office</span>
                <OfficeComboBox defaultValue={searchOffice} onValueChange={(value: string) => {
                  setSearchOffice(value)
                }} />
              </div>
            </div>
            <Button type="submit" className="bg-blue-500">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  )
}