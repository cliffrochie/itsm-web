import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import api from '@/services/use-api'
import { handleAxiosError } from '@/utils/error-handler'
import DesignationComboBox from '@/features/admin/components/comboboxes/designation-combobox'
import OfficeComboBox from '@/features/admin/components/comboboxes/office-combobox'

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

import { IClient } from '@/@types/client'
import { IOffice } from '@/@types/office'
import { IDesignation } from '@/@types/designation'


const formSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }).min(2),
  middleName: z.string().nullable(),
  lastName: z.string({ required_error: 'Last name is required' }).min(2),
  extensionName: z.string(),
  designation: z.string({ required_error: 'Designation is required'}),
  office: z.string({ required_error: 'Office is required'}),
})


export default function AdminClientForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [searchDesignation, setSearchDesignation] = useState('')
  const [searchOffice, setSearchOffice] = useState('')
  const [previousDesignation, setPreviousDesignation] = useState('')
  const [previousOffice, setPreviousOffice] = useState('')
  const [errors, setErrors] = useState<any>(null)
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const [hasOfficeSelected, setHasOfficeSelected] = useState(false)
  const currentPath = location.pathname.split('/')

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
    queryKey: ['clientForm'],
    queryFn: async () => {
      let data: IClient = {
        _id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        office: '',
        designation: '',
      }
      let url = `/api/clients/${params.clientId}/?includes=all`
      if(params.clientId) {
        await api.get(url).then(response => {
          data = response.data
        })
      }
      return data
    }
  })

  useEffect(() => {
    if(isUpdate && data) {

      form.setValue('firstName', data ? data.firstName : '')
      form.setValue('middleName', data ? data.middleName || '' : '')
      form.setValue('lastName', data ? data.lastName : '')
      form.setValue('extensionName', data ? data.extensionName || '' : '')

      let office = null
      if(data && data.office) {
        office = data.office as IOffice
      }

      let designation = null
      if(data && data.designation) {
        designation = data.designation as IDesignation
      }

      setPreviousOffice(office ? office.alias !== undefined ? office.alias || '' : '' : '')
      setPreviousDesignation(designation ? designation.title !== undefined ? designation.title || '' : '' : '')
    }
  }, [data, searchOffice, searchDesignation])
  

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

  async function onSubmit(d: z.infer<typeof formSchema>) {
    try {
      let office = searchOffice
      let designation = searchDesignation
      
      if(isUpdate && !searchOffice) {
        let xOffice = null
        if(data && data.office) {
          xOffice = data.office as IOffice
        }
        office = xOffice ? xOffice._id !== undefined ? xOffice._id || '' : '' : ''
      }

      if(isUpdate && !searchDesignation) {
        let xDesignation = null
        if(data && data.designation) {
          xDesignation = data.designation as IDesignation
        }
        designation = xDesignation ? xDesignation._id !== undefined ? xDesignation._id || '' : '' : ''
      }

      const newData: z.infer<typeof formSchema> = {
        ...d,
        office,
        designation,
      }

      if(isUpdate) {
        const response = await api.put(`/api/clients/${data ? data._id : ''}`, newData)
        if(response.status === 200) {
          toast.success(`${newData.firstName} ${newData.lastName} is updated successfully.`, {
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

          navigate('/admin/clients')
        }
        else {
          console.log(response.status)
        }

      }
      else {
        const response = await api.post(`/api/clients/`, newData)
        if(response.status === 201) {
          toast.success(`${newData.firstName} ${newData.lastName} is created successfully.`, {
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

          navigate('/admin/clients')
        }
        else {
          console.log(response.status)
        }
      }
      
    }
    catch(e) {
      const err = await handleAxiosError(e)
      let obj: any = {}
      obj[err.errors.key] = err.message
      setErrors(obj)
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} Client</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-6/12 md:w-9/12 sm:w-full">
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
                      <Input {...field} value={field.value || ""} className="h-7" />
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
                      <Input {...field} value={field.value || ""} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.extensionName }</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Designation</span>
                <DesignationComboBox className="h-7" defaultValue={searchDesignation} previousValue={previousDesignation} onValueChange={(value: string) => {
                  setSearchDesignation(value)
                }} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Office</span>
                <OfficeComboBox className="h-7" defaultValue={searchOffice} previousValue={previousOffice} onValueChange={(value: string) => {
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