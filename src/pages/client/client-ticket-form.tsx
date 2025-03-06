import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { taskTypes } from "@/data/task-types"
import { equipmentTypes } from "@/data/equipment-types"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import ClientComboBox from "@/features/admin/components/comboboxes/client-combobox"
import { useNavigate } from "react-router-dom"
import api from "@/hooks/use-api"
import { handleAxiosError } from "@/utils/error-handler"
import { Slide, toast } from "react-toastify"
import { capitalizeFirstLetter, formatParagraph } from "@/utils"



const formSchema = z.object({
  title: z.string().min(1, { message: 'This field is required.'}),
  equipmentType: z.string().min(1, { message: 'This field is required.'}),
  taskType: z.string().min(1, { message: 'This field is required.'}),
  natureOfWork: z.string().min(1, { message: 'This field is required.'}),
  client: z.string().min(1, { message: 'This field is required.'}),
})


export default function ClientTicketForm() {
  const [errors, setErrors] = useState<any>(null)
  const [submitTriggered, setSubmitTriggered] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [previousClient, setPreviousClient] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const navigate = useNavigate()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      equipmentType: '',
      taskType: '',
      natureOfWork: '',
      client: '',
    },
  })

  useEffect(() => {
    if(clientSearch) {
      form.setValue('client', clientSearch)
    }
  }, [clientSearch])


  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitted(true)
    console.log(data)
    try {
      const response = await api.post('/api/service-tickets', data)
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

        navigate('/client')
      }
      else {
        toast.error(`Something went wrong.`, {
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
    }
    catch(e) {
      const err = await handleAxiosError(e)
      let obj: any = {}
      obj[err.key] = err.message
      setErrors(obj)
    }
    
  }

  return (
    <div className="">
      <div className="mt-4">
        <div className="py-4 font-semibold">REQUEST SERVICE</div>
        <div className="flex justify-center w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Please provide an information that corresponds to the issue/concern you are currently facing, an IT Personnel will be with you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" id="ticketForm">
                  <FormField  
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={ errors?.title ? 'text-red-500' : ''}>What is your concern?</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            onChange={(e) => {
                              const { value } = e.target;
                              field.onChange(formatParagraph(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage>{ errors?.title }</FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="grid custom-md:grid-cols-2 grid-cols-1 gap-4">
                    <FormField 
                      control={form.control}
                      name="equipmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which device?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="----" />
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
                    <FormField 
                      control={form.control}
                      name="taskType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What type of service?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="----  " />
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
                  </div>
                  <FormField  
                    control={form.control}
                    name="natureOfWork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={ errors?.natureOfWork ? 'text-red-500' : ''}>Please provide additional information about your concern that may help our IT personnel.</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="h-24"
                            placeholder=""
                            onChange={(e) => {
                              const { value } = e.target;
                              field.onChange(formatParagraph(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage>{ errors?.natureOfWork }</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concerning person (client)</FormLabel>
                        <FormControl>
                          <>
                            <ClientComboBox className="" selectItemMsg="----" defaultValue={clientSearch} previousValue={previousClient} onValueChange={(value: string) => {
                              setClientSearch(value)
                            }} />
                            <Input {...field} className="hidden"  />
                          </>
                        </FormControl>
                        <FormMessage>{ errors?.client }</FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="submit" className="bg-blue-500" form="ticketForm">Submit</Button>
                    <Button variant="outline" onClick={() => {
                      navigate('/client')
                    }}>Cancel</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
