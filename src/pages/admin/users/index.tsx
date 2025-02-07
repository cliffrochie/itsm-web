import { useState, useMemo } from 'react'
import { UserRoundPlus } from 'lucide-react'
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

import api from '@/hooks/use-api'

import { UserDataTable } from '@/features/admin/components/data-tables/users/data-table'
import { UserDataTableColumnHeader } from '@/features/admin/components/data-tables/users/data-table-column-header'
import { DataTablePagination } from "@/components/data-tables/data-table-pagination"
import { DataTableRowActions } from '@/components/data-tables/data-table-row-actions'
import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options"

import { roles } from '@/data/user-roles'
import { IUser } from '@/@types/user'


export default function AdminUsersPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const navigate = useNavigate()

  const dataQuery = useQuery({
    queryKey: ['users', pagination, sorting, columnFilters],
    queryFn: async () => {
      let sortValue = ''      
      let data = { rows: [], pageCount: 0, rowCount: 0 }

      let url = `/api/users/`
      url += `?page=${pagination.pageIndex+1}`
      url += `&limit=${pagination.pageSize}`

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

  const defaultData = useMemo(() => [], [])

  const columns: ColumnDef<IUser>[] = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "username",
        header: ({ column }) => (
          <UserDataTableColumnHeader table={table} column={column} accessorKey="username" title="Username" />
        ),
        sortingFn: 'alphanumeric',
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <UserDataTableColumnHeader table={table} column={column} accessorKey="email" title="Email" />
        ),
        sortingFn: 'alphanumeric',
      },
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <UserDataTableColumnHeader table={table} column={column} accessorKey="firstName" title="First Name" />
        ),
        sortingFn: 'alphanumeric',
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => (
          <UserDataTableColumnHeader table={table} column={column} accessorKey="lastName" title="Last Name" />
        ),
        sortingFn: 'alphanumeric',
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <UserDataTableColumnHeader table={table} column={column} accessorKey="role" title="Role" />
        ),
        cell: ({ row }) => {
          const role = roles.find((role) => role.value === row.getValue('role'))
          if(!role) { return null }
          return (
            <div className="flex items-center">
              {role.icon && (
                <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{role.label}</span>
            </div>
          )
        },
        sortingFn: 'alphanumeric',
      },
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
      <h3 className="text-xl font-semibold">Users</h3>
      <div className="py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate('/admin/users/create')}
          >
            <UserRoundPlus />
            Create User
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <UserDataTable table={table} totalColumns={columns.length} />
        <DataTablePagination table={table} />

      </div>
    </section>
  )
}
