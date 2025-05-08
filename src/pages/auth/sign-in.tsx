import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { z } from "zod"
import Logo from '@/assets/images/logo.svg'


const formSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required'}),
  password: z.string().nonempty({ message: 'Password is required'}),
})




export default function SignInPage() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [errors] = useState<any>(null)
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '', 
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log(data)
    try {
      const result = await handleLogin(data.username, data.password)
      console.log(result.data)
      if(result.status === 200) {
        if(result.data && result.data.role === 'admin') {
          navigate('/admin')
        }
        else if(result.data && result.data.role === 'staff') {
          navigate('/service-engineer')
        }
        else if(result.data && result.data.role === 'user') {
          navigate('/client')
        }
        else {
          console.log('last condition for navigation')
        }
      }
      else {
        setInvalidCredentials(true)
      }
    }
    catch(e) {
      console.log(e)
      // setInvalidCredentials(true)
      // const err = await handleAxiosError(e)
      // console.log(err)
      // let obj: any = {}
      // obj[err.key] = err.message
      // setErrors(obj)
    }
  }

  


  return (
    <div className="flex flex-row justify-center h-screen items-center bg-gray-100">
      <div className="bg-gray-100 w-full custom-md:h-screen custom-lg:h-screen overflow-auto flex justify-center items-center custom-sm:px-2">
        <Card className="custom-md:w-[500px] custom-xs:w-[450px] py-10 ">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center align-middle w-auto mb-5">
                <img src={Logo} width="100" alt="logo" className="" />
              </div>
              <div className="text-3xl font-mono font-bold text-gray-600">NIA ITSM</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invalidCredentials && (<div className="bg-red-50 grid gap-1 border border-none rounded-md text-sm p-3 my-2">
              <div className="text-red-600">Invalid credentials, please verify them and retry.</div>
            </div>)}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={ errors?.username ? 'text-red-500' : ''}>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage>{ errors?.username }</FormMessage>
                      </FormItem>
                    )}
                  />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage>{ errors?.password }</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-4 mt-4">
                  <div className="text-sm">Don't have an account? <Link to="/sign-up" className="text-blue-500">Sign-up here.</Link></div>
                </div>
                <Button variant="outline" type="submit" className="mt-5 bg-blue-500 text-white w-full">
                  Sign-in
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
