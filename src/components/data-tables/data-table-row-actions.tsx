"use client"
import { useNavigate } from 'react-router-dom'

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
  useQuery, 
  useMutation,
  useQueryClient,
  keepPreviousData,
  UseMutationResult
} from '@tanstack/react-query'

import { AxiosResponse } from 'axios'



interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  id: string
  updatePath: string
  deleteMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export function DataTableRowActions<TData>({
  row,
  id,
  updatePath,
  deleteMutation,
}: DataTableRowActionsProps<TData>) {

  const navigate = useNavigate()

  return (
    <DropdownMenu>
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
        <DropdownMenuItem onClick={() => navigate(updatePath) } >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deleteMutation.mutate(id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}