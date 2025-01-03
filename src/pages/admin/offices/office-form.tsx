import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import api from '@/services/use-api'
import { handleAxiosError } from '@/utils/error-handler'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { officeTypes } from '@/data/office-types'



const formSchema = z.object({
  name: z.string().min(2),
  alias: z.string(),
  officeType: z.string({ message: 'Please select an office type.' })
})



export default function AdminOfficeForm() {
  const location = useLocation()
  const currentPath = location.pathname.split('/')
  let title = ''
  if(currentPath[currentPath.length-1] === 'create') {
    title = 'Create'
  }
  else if(currentPath[currentPath.length-1] === 'update') {
    title = 'Update'
  }

  const [errors, setErrors] = useState<any>(null)

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      alias: '', 
      officeType: ''
    },
  })


  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
    try {
      const response = await api.post('/api/offices', data)
      if(response.status === 201) {
        toast.success('Success!', {
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

        navigate('/admin/offices')
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
      <h3 className="text-xl font-semibold">{title} Office</h3>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-4/12 md:w-7/12 sm:w-full">
            <Label className="text-gray-500">Office Information</Label>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={ errors?.name ? 'text-red-500' : '' }>Office Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{ errors?.name }</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alias</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="officeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="Select an office type." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {officeTypes.map((officeType) => (
                          <SelectItem key={officeType.value} value={officeType.value}>{officeType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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