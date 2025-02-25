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
import { taskTypes } from "@/data/task-types"
import { equipmentTypes } from "@/data/equipment-types"
import { priorities } from "@/data/priority"
import { serviceStatuses } from "@/data/service-status"
import { capitalizeFirstLetter } from "@/utils"
import api from "@/hooks/use-api"
import { IServiceTicket } from "@/@types/service-ticket"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import getAssignedServiceTickets from "@/features/service-engineer/hooks/get-assigned-service-tickets"




export default function ServiceEngineerPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const navigate = useNavigate()
  const { assignedTickets } = getAssignedServiceTickets()





  return (
    <div className="grid gap-4">
      {/* <section className="grid custom-md:grid-cols-2 custom-lg:grid-cols-3 custom-sm:grid-cols-1 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              ACTIVE TICKETS
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ assignedTickets ? assignedTickets.length : 0 }</div>
          </CardContent>
        </Card>
      </section> */}
      
      <section className="grid custom-md:grid-cols-1 gap-4">
        <div className="">
          <div className="py-4 font-semibold">List of Assigned Tickets</div>
          <div className="rounded-md border shadow">
            <Table>
              <TableBody>
                { assignedTickets && assignedTickets.length > 0 ? assignedTickets.map((data) => (
                  <TableRow key={data._id} onClick={() => { navigate(`/service-engineer/${data.ticketNo}`) }} className="cursor-pointer">
                    <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-1/2 custom-xl:w-1/4">{data.ticketNo} <span className="text-xs font-normal text-gray-500">({capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')})</span></TableCell>
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
