"use client"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosResponse } from 'axios'

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { 
  useQuery, 
  useMutation,
  useQueryClient,
  keepPreviousData,
  UseMutationResult
} from '@tanstack/react-query'

import AppDialogDeleteConfirmation from '@/components/app-dialog-delete-confirmation'




interface DataTableRowActionsProps {
  id: string
  name: string
  updatePath: string
  deleteMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export function DataTableRowActions({
  id,
  name,
  updatePath,
  deleteMutation,
}: DataTableRowActionsProps) {

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(updatePath) }>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            setDialogOpen(true)
            setDropdownOpen(false)
          } }>
            Delete
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => deleteMutation.mutate(id) }>
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <AppDialogDeleteConfirmation dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} name={name} id={id} deleteMutation={deleteMutation} />
    </>
  )
}