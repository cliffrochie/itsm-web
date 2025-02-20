import { Column, Table } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { taskTypes } from "@/data/task-types"
import { equipmentTypes } from "@/data/equipment-types"
import { priorities } from "@/data/priority"

interface ServiceTicketDataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  column: Column<TData, TValue>
  accessorKey: string
  title: string
}

export function ServiceTicketDataTableColumnHeader<TData, TValue>({
  table,
  column,
  accessorKey,
  title,
  className,
}: ServiceTicketDataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-8 data-[state=open]:bg-accent flex justify-between"
          >
            <span className="font-bold text-md">{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="mt-1 mb-2">
        { accessorKey !== 'taskType' && accessorKey !== 'equipmentType' && accessorKey !== 'priority' && accessorKey !== 'createdAt' && (
          <Input
            placeholder={'Filter '+ title.toLowerCase() +'..' }
            className="h-6 text-nowrap p-1"
            value={(table.getColumn(accessorKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(accessorKey)?.setFilterValue(event.target.value)
            }
          />
        )}

        {accessorKey === 'taskType' && (
          <Select onValueChange={(value) => {
            table.getColumn(accessorKey)?.setFilterValue(value)
          }}>
            <SelectTrigger className="h-6 p-1">
              <SelectValue placeholder="All task types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">
                <span className="">All task types</span>
              </SelectItem>
              {taskTypes.map((taskType) => (
                <SelectItem key={taskType.value} value={taskType.value}>
                  <span className="text-red-700">{taskType.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {accessorKey === 'equipmentType' && (
          <Select onValueChange={(value) => {
            table.getColumn(accessorKey)?.setFilterValue(value)
          }}>
            <SelectTrigger className="h-6 p-1">
              <SelectValue placeholder="All equipment types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">
                <span className="">All equipment types</span>
              </SelectItem>
              {equipmentTypes.map((equipmentType) => (
                <SelectItem key={equipmentType.value} value={equipmentType.value}>
                  <span className="text-red-700">{equipmentType.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {accessorKey === 'priority' && (
          <Select onValueChange={(value) => {
            if(value === ' ') {
              table.getColumn(accessorKey)?.setFilterValue('')
            }
            else {
              table.getColumn(accessorKey)?.setFilterValue(value)
            }
          }}>
            <SelectTrigger className="h-6 p-1">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">
                <span className="">All priorities</span>
              </SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <span className="text-red-700">{priority.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}