import { useState, useEffect, useMemo } from 'react' 
import { Briefcase, Ticket, TicketCheck, TicketSlash, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef, ColumnFiltersState, getCoreRowModel, PaginationState, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils';

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
      <section className="grid custom-md:grid-cols-1 gap-4">
        <div className="mt-4">
          <div className="py-4 font-semibold">ASSIGNED  TICKETS</div>
          <div className="flex justify-center w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>
                  List of tickets assigned for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody className="border rounded-md">
                    { assignedTickets && assignedTickets.length > 0 ? assignedTickets.map((data) => (
                      <TableRow key={data._id} onClick={() => { navigate(`/service-engineer/${data.ticketNo}`) }} className="cursor-pointer">
                        <TableCell className="font-medium p-5 custom-sm:w-60">{data.ticketNo}</TableCell>
                        <TableCell className="font-normal p-5 hidden custom-lg:block">
                          {data.title}
                        </TableCell>
                        <TableCell className="font-medium p-5 custom-sm:w-60 ">
                          <Badge variant="outline" className="border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">{capitalizeFirstLetter(data.priority ? data.priority : 'No')} Priority</Badge>
                        </TableCell>
                        {/* <TableCell className="font-medium p-5 custom-sm:w-60 hidden custom-md:block ">
                          <Badge className="border-transparent bg-blue-400 text-primary-foreground shadow hover:bg-primary/80">
                            {capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="font-medium p-5 custom-md:w-48">
                          <span className="text-gray-500 hidden custom-md:block">{ data.createdAt ? formatDate(data.createdAt) : undefined }</span>
                        </TableCell>
                      </TableRow>
                    ))
                    : (<TableRow>
                      <TableCell className="font-medium p-5">No assigned service tickets</TableCell>
                      </TableRow>)
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div> 
      </section>
    </div>
  )
}
