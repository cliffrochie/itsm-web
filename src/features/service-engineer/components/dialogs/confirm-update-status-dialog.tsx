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



interface IUpdateStatusDialogProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id?: string
  name?: string
  newValue?: string
  currentValue?: string
  selectedServiceStatus?: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}

export default function UpdateStatusAssignedTicketDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  name,
  newValue,
  currentValue,
  updateMutation
}: IUpdateStatusDialogProps) {
 

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="custom-sm:w-[420px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Update Service Status</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-4 py-3 px-4 border rounded-md">
            <p className="text-md">Change to <span className="font-semibold text-blue-600">{capitalizeFirstLetter(newValue as string)}</span>?</p>
          </div>
        <DialogFooter className="gap-2">
          <Button type="submit" className="custom-md:w-20" variant="outline" onClick={() => setDialogOpen(false)}>
            No
          </Button>
          <Button type="submit" className="custom-md:w-20 bg-blue-500" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: String(id), 
              name: name, 
              serviceStatus: newValue
            }))
            setDialogOpen(false)
          }}>Yes</Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}