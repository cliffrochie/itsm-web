import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Label } from "@radix-ui/react-dropdown-menu"
import { LogIn } from "lucide-react"
import { FormEvent, useState } from "react"
import { useNavigate, Link } from "react-router-dom"



export default function SignInPage() {
  const navigate = useNavigate()
  const { user, loading, handleLogin } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
  

  async function submitHandler(e: FormEvent) {
    e.preventDefault()

    console.log('submit')

    try {
      await handleLogin(username, password)

      if(!loading && user && user.role === 'admin') {
        console.log(user)
        console.log('go to admin')
        navigate('/admin')
      }
      else if(!loading && user && user.role === 'staff') {
        console.log(user)
        console.log('go to service engineer')
        navigate('/service-engineer')
      }
      else if(!loading && user && user.role === 'user') {
        console.log(user)
        console.log('go to client')
        navigate('/client')
      }
    }
    catch(error: any) {
      alert(error)
    }
  }

  return (
    <div className="flex flex-row justify-center h-screen items-center">
      <div className="bg-gray-100 w-full h-screen custom-lg:h-screen overflow-auto flex justify-center items-center">
        <Card className="w-[450px] py-10">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center align-middle w-auto mb-5">
                <LogIn size={40} color="gray" />
              </div>
              <div className="text-4xl font-mono font-bold text-gray-600">NIA ITSM</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Username</Label>
                  <Input id="username" name="username" type="text" placeholder="Your username here" onChange={(e) => setUsername(e.target.value) } />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Your password here" onChange={(e) => setPassword(e.target.value) } />
                </div>
              </div>
              <div className="grid w-full items-center gap-4 mt-4">
                <div className="text-sm">Don't have an account? <Link to="/sign-up" className="text-blue-500">Sign-up here.</Link></div>
              </div>
              <Button variant="outline" type="submit" className="mt-5">Sign-in</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
