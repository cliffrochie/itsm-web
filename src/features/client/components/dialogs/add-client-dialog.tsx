import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import DesignationComboBox from '@/features/admin/components/comboboxes/designation-combobox'
import OfficeComboBox from '@/features/admin/components/comboboxes/office-combobox'

import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from "axios"


interface ThisInterface {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  name?: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export default function AddClientDialog({
  dialogOpen, 
  setDialogOpen,
  name,
  updateMutation
}: ThisInterface) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    firstName: '',
    lastName: '',
    // designation: '',
    // office: '',
  })
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [extensionName, setExtensionName] = useState('')
  const [searchDesignation, setSearchDesignation] = useState('') 
  const [searchOffice, setSearchOffice] = useState('') 

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if(!firstName) {
      newErrors.firstName = 'First name is required'
    }

    if(!lastName) {
      newErrors.lastName = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if(firstName) {
      setErrors((prev) => ({...prev, firstName: ''}))
    }
  }, [firstName])

  useEffect(() => {
    if(lastName) {
      setErrors((prev) => ({...prev, lastName: ''}))
    }
  }, [lastName])


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <div>
            <Input value={firstName} className={errors.firstName ? 'border-red-500' : ''} placeholder="First Name (required)" onChange={(e) => setFirstName(e.target.value.toUpperCase()) } />
            {errors.firstName && <span className="text-red-600 text-sm p-1">{errors.firstName}</span>}
          </div>
          <div>
            <Input value={middleName} placeholder="Middle Name" onChange={(e) => setMiddleName(e.target.value.toUpperCase()) } />
          </div>
          <div>
            <Input value={lastName} className={errors.lastName ? 'border-red-500' : ''} placeholder="Last Name (required)" onChange={(e) => setLastName(e.target.value.toUpperCase()) } />
            {errors.lastName && <span className="text-red-600 text-sm p-1">{errors.lastName}</span>}
          </div>
          <div>
            <Input value={extensionName} placeholder="Ext." onChange={(e) => setExtensionName(e.target.value.toUpperCase()) } />
          </div>
          <div>
            <DesignationComboBox defaultValue={searchDesignation} onValueChange={(value: string) => {
              setSearchDesignation(value)
            }} />
          </div>
          <div>
            <OfficeComboBox defaultValue={searchOffice} onValueChange={(value: string) => {
              setSearchOffice(value)
            }} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            
            
            
            const result = validate()
            console.log(result)

            if(result) {
              updateMutation.mutate(JSON.stringify({
                firstName,
                middleName,
                lastName,
                extensionName,
                designation: searchDesignation,
                office: searchOffice 
              }))
              setDialogOpen(false)
            }

          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}