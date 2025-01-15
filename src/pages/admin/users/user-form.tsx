import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import api from '@/services/use-api'
import { handleAxiosError } from '@/utils/error-handler'

import { useQuery } from '@tanstack/react-query'

import { toast, Slide } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { IUser } from '@/@types/user'


const formSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string().nullable(),
  lastName: z.string().min(2),
  extensionName: z.string().nullable(),
  username: z.string().min(4),
  email: z.string().email(),
  contactNo: z.string().max(13).regex(/^\d+$/, {
    message: "Must be a string containing only numbers",
  }).nullable(),
  password: z.string().nonempty(),
  password2: z.string().nonempty(),
  role: z.enum(['user', 'staff', 'admin'], {
    message: 'You need to select a user role.'
  })
})

export default function AdminUserForm() {
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
    queryKey: ['userForm'],
    queryFn: async () => {
      let data: IUser = {
        _id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        username: '',
        email: '',
        contactNo: '',
        role: 'user'
      }
      let url = `/api/users/${params.userId}`
      if(params.userId) {
        await api.get(url).then(response => {
          data = response.data
        })
      }
      return data
    }
  }) 

  useEffect(() => {
    if(isUpdate) {
      console.log(data)
      form.setValue('firstName', data ? data.firstName : '')
      form.setValue('middleName', data ? data.middleName !== undefined ? data.middleName : '' : '')
      form.setValue('lastName', data ? data.lastName : '')
      form.setValue('extensionName', data ? data.extensionName !== undefined ? data.extensionName : '' : '')
      form.setValue('username', data ? data.username : '')
      form.setValue('email', data ? data.email : '')
      form.setValue('contactNo', data ? data.contactNo !== undefined ? data.contactNo : '' : '')
      form.setValue('role', data ? data.role : 'user')
    }
  }, [data])  


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      username: '',
      email: '',
      password: '', 
      password2: '',
    },
  })


  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
    try {
      if(isUpdate) {
        
        const updatedData = {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          extensionName: data.extensionName,
          username: data.username,
          email: data.email,
          contactNo: data.contactNo,
          role: data.role
        }

        const response = await api.put(`/api/users/${params.userId}`, updatedData)
        if(response.status === 200) {
          toast.success('User created successfully.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
  
          navigate('/admin/users')
        }
        else {
          console.log(response.status)
        }
        
      }
      else {
        const response = await api.post('/api/users/signup', data)
        if(response.status === 201) {
          toast.success('User created successfully.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
  
          navigate('/admin/users')
        }
        else {
          console.log(response.status)
        }
      }
      
    }
    catch(e) {
      const err = await handleAxiosError(e)
      console.log(err)
      let obj: any = {}
      obj[err.key] = err.message
      setErrors(obj)
    }
  }


  return (
    <section>
      <h3 className="text-xl font-semibold">{title} User</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-8/12 md:w-7/12 sm:w-full">
            <Label className="text-gray-500">User Information</Label>
            <div className="grid lg:grid-cols-4 sm:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="extensionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extension Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.username ? 'text-red-500' : ''}>Username</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.username }</FormMessage>
                  </FormItem>
                )}
              />
              <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={ errors?.email ? 'text-red-500' : ''}>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="h-7" />
                      </FormControl>
                      <FormMessage>{ errors?.email }</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={ errors?.contactNo ? 'text-red-500' : ''}>Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} type="contactNo" className="h-7" />
                      </FormControl>
                      <FormMessage>{ errors?.contactNo }</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
              { !isUpdate && (
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Confirmation</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-y-1 gap-9"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="user" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              User
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="staff" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Staff
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Admin
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" className="bg-blue-500">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  )
}