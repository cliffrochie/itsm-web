import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from '@/hooks/use-api'
import { Slide, toast } from "react-toastify"








export default function ProfilePage() {
  const [currentTab, setCurrentTab] = useState('change-password')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<any>({sample: 'errors'})

  const { user, handleLogin } = useAuth()

  function updateDisplayTab(tab: string) {
    setCurrentTab(tab)
  }

  
  async function checkUserPassword(currentPassword: string) {
    try {

      const username = user ? user.username : 'guest'

      console.log('username: ', username)
      console.log('password: ', )

      const response = await handleLogin(username, currentPassword)
      const result = response.status === 200 ? true : false
      return result
    }
    catch(error) {
      return false
    }
  }


  async function onSubmitChangePassword(currentPassword: string, newPassword: string, newPasswordConfirm: string) {
    try {
      const correctCurrentPassword = await checkUserPassword(currentPassword)
      const newPasswordsMatched = newPassword === newPasswordConfirm
      let errorMessages = {
        newPassword: '',
        currentPassword: '',
      }

      console.log(correctCurrentPassword)


      if(!correctCurrentPassword) {
        errorMessages = { ...errorMessages, currentPassword: 'Invalid password' }
      }
      else {
        errorMessages.currentPassword = ''
      }
      if(newPassword && newPasswordConfirm && !newPasswordsMatched) {
        errorMessages = { ...errorMessages, newPassword: 'Your passwords did not match.' }
      }
      else if((newPassword && !newPasswordConfirm) || (!newPassword && newPasswordConfirm)) {
        errorMessages = { ...errorMessages, newPassword: 'Your passwords did not match.' }
      }
      else {
        errorMessages.newPassword = ''
      }

      console.log(errorMessages)
      setErrors(errorMessages)

      if(errorMessages.newPassword === '' && errorMessages.currentPassword === '') {
        const response = await api.patch(`/api/users/${user?._id}/change-password`, { password: newPassword })
        if(response.status === 200) {
          toast.success(`Password is updated successfully.`, {
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

          setCurrentTab('user-information')
        }
      }
    }
    catch(error) {
      console.log(error)
    }
    
  }

  return (
    <section className="grid gap-4">
      <div className="text-xl font-semibold">User Profile</div>
      <div className="grid gap-2 custom-xs:grid-cols-1 custom-sm:grid-cols-[180px,auto]">
        <div id="tabs" className="">
          <div className="grid justify-start custom-xs:grid-cols-2 custom-sm:grid-cols-1 gap-1">
            <Button 
              variant="ghost" 
              className={ currentTab === 'user-information' ? "custom-xs:justify-center custom-sm:justify-start font-semibold bg-gray-100" : "custom-xs:justify-center custom-sm:justify-start font-normal" }
              onClick={() => updateDisplayTab('user-information') }
            >
              User Information
            </Button>
            <Button 
              variant="ghost" 
              className={ currentTab === 'change-password' ? "custom-xs:justify-center custom-sm:justify-start font-semibold bg-gray-100" : "custom-xs:justify-center custom-sm:justify-start font-normal" }
              onClick={() => updateDisplayTab('change-password') }
            >
              Change Password
            </Button>
          </div>
        </div>
        <div className="">
          <div id="user-information" className={currentTab === 'user-information' ? '' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>User Information!!</CardTitle>
                <CardDescription>
                  Work in progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div id="change-password" className={currentTab === 'change-password' ? '' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  You can change your password here by providing the necessary details.
                </CardDescription>
                <CardContent>
                  <div className="grid gap-4 my-5 custom-xs:w-full custom-sm:w-96">
                    <div className="grid gap-2">
                      <Label className={ errors.currentPassword ? 'text-red-500' : ''}>Current Password</Label>
                      <Input name="currentPassword" className="" type="password" onChange={(e) => setCurrentPassword(e.target.value)} />
                      {errors.currentPassword && (<span className="text-sm text-red-500">{errors.currentPassword}</span>)}
                    </div>
                    <div className="grid gap-2">
                      <Label className={ errors.newPassword ? 'text-red-500' : ''}>New Password</Label>
                      <Input name="newPassword" className="" type="password" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label className={ errors.newPassword ? 'text-red-500' : ''}>New Password Confirmation</Label>
                      <Input name="newPasswordConfirmation" className="" type="password" onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
                      {errors.newPassword && (<span className="text-sm text-red-500">{errors.newPassword}</span>)}
                    </div>
                    <Button 
                      className="bg-blue-500 mt-3 custom-xs:w-full custom-sm:w-24"
                      onClick={() => onSubmitChangePassword(currentPassword, newPassword, newPasswordConfirmation) }
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}