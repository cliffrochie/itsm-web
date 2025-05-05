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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { capitalizeFirstLetter } from "@/utils"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slide, toast } from "react-toastify"
import { AxiosResponse } from "axios"
import { Badge } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatDate } from "@/utils"
import { IServiceTicket } from "@/@types/service-ticket"
import { IUser } from "@/@types/user"


interface IProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id?: string
  title: string
  name?: string
  data: any[]
}

export default function DataListDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  title,
  name,
  data
}: IProps) {
  const navigate = useNavigate()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="font-semibold text-gray-500">List of data:</div>
            <Table>
              <TableBody className="border rounded-md">
                {data.length > 0 ? data.map((ticket) => (
                  <TableRow key={ticket._id}  className="cursor-pointer" onClick={() => navigate(`/admin/it-service-tickets/${ticket._id}/view`) }>
                    <TableCell className="font-medium">{ticket.ticketNo}</TableCell>
                    <TableCell className="font-medium p-5 custom-md:w-48 text-right">
                      <span className="text-gray-500">{ ticket.createdAt ? formatDate(ticket.createdAt) : undefined }</span>
                    </TableCell>
                  </TableRow>
                )) : (<TableRow>
                  <TableCell className="p-5">No tickets yet</TableCell>
                  </TableRow>)
                }
              </TableBody>
            </Table>
          </div>
        <DialogFooter>
          <Button variant="outline" className="w-24 bg-blue-500 text-white" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}