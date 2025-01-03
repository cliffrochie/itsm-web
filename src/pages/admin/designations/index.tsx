import { useState, useMemo } from 'react'
import { Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { 
  useQuery, 
  keepPreviousData 
} from '@tanstack/react-query'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

import api from '@/services/use-api'

import { DesignationDataTable } from '@/features/admin/components/data-tables/designations/data-table'
import { DataTableColumnHeader } from '@/features/admin/components/data-tables/designations/data-table-column-header'

import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options"
import { DataTableRowActions } from '@/components/data-tables/data-table-row-actions'
import { DataTablePagination } from "@/components/data-tables/data-table-pagination"

import { IDesignation } from '@/@types/designation'


export default function AdminDesignationsPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const navigate = useNavigate()

  const dataQuery = useQuery({
    queryKey: ['data', pagination, sorting, columnFilters],
    queryFn: async () => {
      let sortValue = ''      
      let data = { rows: [], pageCount: 0, rowCount: 0 }

      let url = `/api/designations/`
      url += `?page=${pagination.pageIndex+1}`
      url += `&limit=${pagination.pageSize}`

      if(sorting.length > 0) {
        sorting.forEach(sort => {
          sortValue = sort.desc ? '-'+ sort.id : sort.id
          url += `&sort=${sortValue}`
        })
      }
      
      if(columnFilters.length > 0) {
        columnFilters.forEach(filter => url += `&${filter.id}=${filter.value}` )
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

  const defaultData = useMemo(() => [], [])

  const columns: ColumnDef<IDesignation>[] = useMemo<ColumnDef<IDesignation>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader table={table} column={column} accessorKey="title" title="Position title" />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <div className="flex justify-end"><DataTableRowActions row={row} /></div>
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
    <section>
      <h3 className="text-xl font-semibold">Designations</h3>
      <div className="container py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate('/admin/designations/create')}
          >
            <Briefcase />
            Create Designation
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <DesignationDataTable table={table} totalColumns={columns.length} />
        <DataTablePagination table={table} />
      </div>
    </section>
  )
}
