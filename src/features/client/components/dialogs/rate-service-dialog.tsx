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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"




interface IRateServiceDialog {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id: string
  name: string
  serviceEngineerName: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export default function RateServiceDialog({
  dialogOpen,
  setDialogOpen,
  id,
  name,
  serviceEngineerName,
  updateMutation
}: IRateServiceDialog) {
  const [rating, setRating] = useState('n')
  const [ratingComment, setRatingComment] = useState('')

  useEffect(() => {

  }, [dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Service Performance</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">Service Engineer:&nbsp;{serviceEngineerName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="text-sm text-gray-700">Please rate the service or support provided by the assigned service engineer.</div>
          <RadioGroup defaultValue="n" className="flex flex-col gap-2" value={rating} onValueChange={setRating}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="mt-1" value="vs" id="vs" />
              <Label htmlFor="vs" className="text-[13px] cursor-pointer">Very satisfied</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="mt-1" value="s" id="s" />
              <Label htmlFor="s" className="text-[13px] cursor-pointer">Satisfied</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="mt-1" value="n" id="n" />
              <Label htmlFor="n" className="text-[13px] cursor-pointer">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="mt-1" value="d" id="d" />
              <Label htmlFor="d" className="text-[13px] cursor-pointer">Dissatisfied</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="mt-1" value="vd" id="vd" />
              <Label htmlFor="vd" className="text-[13px] cursor-pointer">Very dissatisfied</Label>
            </div>
          </RadioGroup>
          <Textarea defaultValue={ratingComment} onChange={(e) => setRatingComment(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: String(id), 
              rating,
              ratingComment, 
            }))
            setDialogOpen(false)
          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
