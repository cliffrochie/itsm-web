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

import { roles } from '@/data/user-roles'


interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  column: Column<TData, TValue>
  accessorKey: string
  title: string
}

export function UserDataTableColumnHeader<TData, TValue>({
  table,
  column,
  accessorKey,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
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
        {accessorKey !== 'role' && (
          <Input
            placeholder={'Filter '+ title.toLowerCase() +'..' }
            className="h-6 text-nowrap p-1"
            value={(table.getColumn(accessorKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(accessorKey)?.setFilterValue(event.target.value)
            }
          />
        )}

        {accessorKey === 'role' && (
          <Select onValueChange={(value) => {
            table.getColumn(accessorKey)?.setFilterValue(value)
          }}>
            <SelectTrigger className="h-6 p-1">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">
                <span className="">All roles</span>
              </SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <span className="">{role.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}