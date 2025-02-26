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
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


const formSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(3),
  serviceStatus: z.string().nullable(),
  taskType: z.string({ required_error: 'Last name is required' }).min(3),
  natureOfWork: z.string({ required_error: 'Designation is required'}),
  office: z.string({ required_error: 'Office is required'}),
})


export default function ClientTicketForm() {
  const [errors, setErrors] = useState<any>(null)
  const [submitTriggered, setSubmitTriggered] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      serviceStatus: '',
      taskType: '',
    },
  })

  async function onSubmit() {

  }

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 custom-lg:mx-60 custom-md:mx-36 custom-sm:mx-20">
        <div className="font-semibold">REQUEST SERVICE</div>
        <div>
        <Card className="w-auto">
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Please select an ICT service that corresponds to the issue/concern you are currently facing, an IT Personnel will be with you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Form {...form }>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">

                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="bg-blue-500">Submit</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
        </div>
      </section>
    </div>
  )
}
