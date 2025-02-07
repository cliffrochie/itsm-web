import { useState, useMemo } from 'react'
import { HousePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { 
  useQuery, 
  useMutation,
  useQueryClient,
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

import api from '@/hooks/use-api'

import { OfficeDataTable } from '@/features/admin/components/data-tables/offices/data-table'
import { OfficeDataTableColumnHeader } from '@/features/admin/components/data-tables/offices/data-table-column-header'

import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options"
import { DataTableRowActions } from '@/components/data-tables/data-table-row-actions'
import { DataTablePagination } from "@/components/data-tables/data-table-pagination"

import { officeTypes } from '@/data/office-types'
import { IOffice } from '@/@types/office'

export default function AdminOfficesPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const defaultData = useMemo(() => [], [])

  const officeQueryKey = ['offices', pagination, sorting, columnFilters]

  const dataQuery = useQuery({
    queryKey: officeQueryKey,
    queryFn: async () => {
      let sortValue = ''      
      let data = { rows: [], pageCount: 0, rowCount: 0 }

      let url = `/api/offices/`
      url += `?page=${pagination.pageIndex+1}`
      url += `&limit=${pagination.pageSize}`
      url += `&includes=parentOffice`

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


  const deleteMutation = useMutation({
    mutationKey: officeQueryKey,
    mutationFn: async (id: string) => {
      return await api.delete(`/api/offices/${id}`)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: officeQueryKey })
    }
  })


  const columns: ColumnDef<IOffice>[] = useMemo<ColumnDef<IOffice>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <OfficeDataTableColumnHeader table={table} column={column} accessorKey="name" title="Name" />
        ),
      },
      {
        accessorKey: "alias",
        header: ({ column }) => (
          <OfficeDataTableColumnHeader table={table} column={column} accessorKey="alias" title="Alias" />
        ),
      },
      {
        accessorKey: "officeType",
        header: ({ column }) => (
          <OfficeDataTableColumnHeader table={table} column={column} accessorKey="officeType" title="Office Type" />
        ),
        cell: ({ row }) => {
          const officeType = officeTypes.find((officeType) => officeType.value === row.getValue('officeType'))
          if(!officeType) { return null }
          return (
            <div className="flex items-center">
              {officeType.icon && (
                <officeType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{officeType.label}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <div className="flex justify-end">
          <DataTableRowActions 
            id={row.original._id} 
            name={row.original.name} 
            updatePath={`/admin/offices/${row.original._id}/update`} 
            deleteMutation={deleteMutation} 
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
    <section>
      <h3 className="text-xl font-semibold">Offices</h3>
      <div className="py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate('/admin/offices/create')}
          >
            <HousePlus />
            Create Office
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <OfficeDataTable table={table} totalColumns={columns.length} />
        <DataTablePagination table={table} />
      </div>
    </section>
  )
}
