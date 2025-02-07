import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link, useParams } from "react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import api from '@/hooks/use-api'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IUser } from '@/@types/user'
import { withMask } from 'use-mask-input'


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
})


export default function SignUpPage() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<any>(null)


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
          className: 'text-sm',
        });

        setTimeout(() => {
          navigate('/sign-in')
        }, 500)
      }
      else {
        console.log(response.status)
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
    <>
      <section className="bg-gray-100">
        <div className="flex flex-col justify-center h-screen items-center">
          <Card className="w-[800px] py-10">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="flex justify-center align-middle w-auto mb-5">
                </div>
                <div className="text-5xl font-mono font-bold text-gray-600">Create an Account</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-16">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full grid gap-4">
                  <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
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
                            <Input {...field} value={field.value || ""} ref={withMask('99999999999')} type="contactNo" className="h-7" />
                          </FormControl>
                          <FormMessage>{ errors?.contactNo }</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid lg:grid-cols-[auto,auto,auto,100px] sm:grid-cols-1 gap-4">
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
                          <FormLabel>Extension</FormLabel>
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
                  <Button type="submit" className="bg-blue-500">Submit</Button>
                </form>
              </Form>
              <div className="py-5 text-sm">
                Already have an account? <Link to="/sign-in" className="text-blue-500">Sign-in here.</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
