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
import { Label } from "@/components/ui/label"
import { serviceStatuses } from '@/data/service-status'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { capitalizeFirstLetter } from "@/utils"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slide, toast } from "react-toastify"
import { AxiosResponse } from "axios"
import UserComboBox from '@/features/admin/components/comboboxes/user-combobox'
import { Textarea } from "@/components/ui/textarea"


interface IUpdateStatusDialogProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id?: string
  name?: string
  currentServiceEngineer: string
  currentPriorityLevel: string
  excludeUser: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}

export default function EscalateServiceDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  name,
  currentServiceEngineer,
  currentPriorityLevel,
  excludeUser,
  updateMutation
}: IUpdateStatusDialogProps) {
  const [selectedPriority, setSelectedPriority] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [previousUser, setPreviousUser] = useState('')
  const [adminRemarks, setAdminRemarks] = useState('')

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Escalate Service</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-6 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Current Service Engineer</Label>
                <div className="text-gray-600 text-sm border rounded-[6px] p-[7px] bg-gray-50">{currentServiceEngineer}</div>
              </div>
              <div className="grid gap-2">
                <Label>Escalted Service Engineer</Label>
                <UserComboBox defaultValue={searchUser} previousValue={previousUser} excludeUser={excludeUser} onValueChange={(value: string) => {
                  setSearchUser(value)
                }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Current Priority Level</Label>
                <div className="text-gray-600 text-sm border rounded-[6px] p-[7px] bg-gray-50">{capitalizeFirstLetter(currentPriorityLevel)}</div>
              </div>
              <div className="grid gap-2">
                <Label>Escalate Priority Level</Label>
                <Select 
                  value={selectedPriority}
                  onValueChange={(value) => {
                    setSelectedPriority(value)
                  }}
                >
                  <SelectTrigger className="w-full text-foreground px-4">
                    <SelectValue placeholder="Select a priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority level</SelectLabel>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Textarea
              placeholder="Remarks"
              className="h-24"
              onChange={(event) => {
                setAdminRemarks(event.target.value)
              }}
            />
          </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: id,
              name: name,
              serviceEngineer: searchUser,
              priority: selectedPriority,
              adminRemarks: adminRemarks
            }))
            setDialogOpen(false)
          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}