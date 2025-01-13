"use client"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { 
  useQuery, 
  useMutation,
  useQueryClient,
  keepPreviousData 
} from '@tanstack/react-query'

import { IOffice } from '@/@types/office'
import api from '@/services/use-api'
import { toast, Slide } from 'react-toastify';
import { handleAxiosError } from '@/utils/error-handler'


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  data: IOffice
}

export function DataTableRowActions<TData>({
  row,
  data
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
        <DropdownMenuItem onClick={() => navigate(`/admin/offices/${data._id}/update`) } >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}