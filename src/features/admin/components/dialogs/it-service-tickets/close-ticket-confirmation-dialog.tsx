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



interface IProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id?: string
  name?: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}

export default function CloseTicketConfirmationDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  name,
  updateMutation
}: IProps) {

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Close Ticket</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-4 py-3">
           <p>Are you sure you want to close <span className="font-semibold text-red-500">{name}</span>?</p>
          </div>
        <DialogFooter>
          <Button variant="outline" className="w-24" onClick={() => setDialogOpen(false)}>No</Button>
          <Button type="submit" className="bg-blue-500 w-24" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: String(id), 
              name: name, 
            }))
            setDialogOpen(false)
          }}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}