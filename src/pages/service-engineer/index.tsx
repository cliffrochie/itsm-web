import { useState, useEffect, useMemo } from 'react' 
import { Briefcase, Ticket, TicketCheck, TicketSlash, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



import { ColumnDef, ColumnFiltersState, getCoreRowModel, PaginationState, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ServiceTicketDataTable } from "@/features/admin/components/data-tables/service-tickets/data-table"
import { ServiceTicketDataTableColumnHeader } from "@/features/admin/components/data-tables/service-tickets/data-table-column-header"
import { DataTableRowActions } from "@/components/data-tables/data-table-row-actions"
import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options"
import { DataTablePagination } from "@/components/data-tables/data-table-pagination"
import { isClientInterface } from "@/@types/client"
import { isUserInterface } from '@/@types/user'
import getAssignedServiceTickets from "@/features/service-engineer/hooks/get-assigned-service-tickets"
import { taskTypes } from "@/data/task-types"
import { equipmentTypes } from "@/data/equipment-types"
import { priorities } from "@/data/priority"
import { serviceStatuses } from "@/data/service-status"
import { capitalizeFirstLetter } from "@/utils"
import api from "@/hooks/use-api"
import { IServiceTicket } from "@/@types/service-ticket"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';



export default function ServiceEngineerPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { assignedTickets } = getAssignedServiceTickets()
  const defaultData = useMemo(() => [], [])
  const serviceTicketQueryKey = ['serviceTicket', pagination, sorting, columnFilters]

  const dataQuery = useQuery({
    queryKey: serviceTicketQueryKey,
    queryFn: async () => {
      let sortValue = ''      
      let data = { rows: [], pageCount: 0, rowCount: 0 }

      let url = `/api/service-tickets/`
      url += `?page=${pagination.pageIndex+1}`
      url += `&limit=${pagination.pageSize}`
      url += `&includes=all`
      url += `&sort=-createdAt`

      if(sorting.length > 0) {
        sorting.forEach(sort => {
          sortValue = sort.desc ? '-'+ sort.id : sort.id
          url += `&sort=${sortValue}`
        })
      }
      
      if(columnFilters.length > 0) {
        columnFilters.forEach(filter => {
          if(filter.value && filter.value !== ' ') {
            url += `&${filter.id}=${filter.value}`
          }
        })
      } 

      await api.get(url).then(response => {
        data.rows = response.data?.results  
        data.pageCount = response.data?.totalPages
        data.rowCount = response.data?.total
      })

      return data
    },
    placeholderData: keepPreviousData
  })


  const columns: ColumnDef<IServiceTicket>[] = useMemo<ColumnDef<IServiceTicket>[]>(
    () => [
      {
        accessorKey: "ticketNo",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="ticketNo" title="Ticket No." />
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="date" title="Date" />
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="priority" title="Priority Level" />
        ),
        cell: ({ row }) => {
          const priority = priorities.find((priority) => priority.value === row.getValue('priority'))
          if(!priority) { return null }
          return (
            <div className="flex items-center">
              {priority.icon && (
                <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{priority.label}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "taskType",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="taskType" title="Task Type" />
        ),
        cell: ({ row }) => {
          const taskType = taskTypes.find((taskType) => taskType.value === row.getValue('taskType'))
          if(!taskType) { return null }
          return (
            <div className="flex items-center">
              {taskType.icon && (
                <taskType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{taskType.label}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "serviceStatus",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="serviceStatus" title="Service Status" />
        ),
        cell: ({ row }) => {
          const serviceStatus = serviceStatuses.find((serviceStatus) => serviceStatus.value === row.getValue('serviceStatus'))
          if(!serviceStatus) { return null }
          return (
            <div className="flex items-center">
              {serviceStatus.icon && (
                <serviceStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{serviceStatus.label}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "equipmentType",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="equipmentType" title="Equipment/Device" />
        ),
        cell: ({ row }) => {
          const equipmentType = equipmentTypes.find((equipmentType) => equipmentType.value === row.getValue('equipmentType'))
          if(!equipmentType) { return null }
          return (
            <div className="flex items-center">
              {equipmentType.icon && (
                <equipmentType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{equipmentType.label}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "client",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader table={table} column={column} accessorKey="client" title="Client" />
        ),
        cell: ({ row }) => {
          const firstName = isClientInterface(row.original.client) ? row.original.client.firstName : ''
          const lastName = isClientInterface(row.original.client) ? row.original.client.lastName : ''
          const fullName = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1).toLowerCase() +' '+ String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1).toLowerCase()

          return (
            <div className="flex w-full items-center">
              <span>{fullName}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <div className="flex justify-end">
          <DataTableRowActions 
            id={row.original._id} 
            name={row.original.ticketNo} 
            viewPath={`/admin/it-service-tickets/${row.original._id}/view`}
            updatePath={`/admin/it-service-tickets/${row.original._id}/update`} 
          />
        </div>
      }
    ], []
  )

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    rowCount: dataQuery.data?.rowCount,
    manualSorting: true,
    manualPagination: true, 
    manualFiltering: true,
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  })

  return (
    <div className="grid gap-4">
      <section className="grid custom-md:grid-cols-2 grid-cols-1 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              ASSIGNED TICKETS
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ assignedTickets ? assignedTickets.length : 0 }</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              CLOSED/COMPLETED TICKETS
            </CardTitle>
            <TicketCheck className="text-gray-500"  />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid custom-md:grid-cols-1 gap-4">
        <div className="">
          <div className="py-4 font-semibold">List of Assigned Tickets</div>
          <div className="rounded-md border shadow">
            <Table>
              <TableBody>
                { assignedTickets ? assignedTickets.map((data) => (
                  <TableRow key={data._id} onClick={() => { navigate(`/service-engineer/${data.ticketNo}`) }} className="cursor-pointer">
                    <TableCell className="font-medium p-5">{data.ticketNo} <span className="text-xs font-normal text-gray-500">({capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')})</span></TableCell>
                    {/* <TableCell className="font-medium p-5">{capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')}</TableCell> */}
                    <TableCell className="font-medium p-5">{capitalizeFirstLetter(data.priority ? data.priority : 'No')} Priority</TableCell>
                  </TableRow>
                ))
                : (<TableRow>
                   <TableCell className="font-medium p-5">No assigned service tickets</TableCell>
                  </TableRow>)
                }
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  )
}
