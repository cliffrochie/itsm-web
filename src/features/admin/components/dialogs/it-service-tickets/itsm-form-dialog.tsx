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
import ITSMForm from "@/features/admin/pdf/itsm-form"

interface IUpdateStatusDialogProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id: string
  name: string
  data: any
}

export default function ITSMFormDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  name,
  data,
}: IUpdateStatusDialogProps) {
  console.log(data)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] md:max-w-[1200px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full">
        <DialogHeader>
          <DialogTitle>IT Service Ticket Form</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-6 py-3">
            <ITSMForm data={data} />
          </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            setDialogOpen(false)
          }}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}