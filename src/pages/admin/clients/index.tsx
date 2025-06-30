import { useState, useMemo } from "react";
import { ContactRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import api from "@/hooks/use-api";

import { ClientDataTable } from "@/components/data-tables/client--data-table";
import { DataTableColumnHeader } from "@/components/data-tables/client--data-table-column-header";

import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options";
import { DataTableRowActions } from "@/components/data-tables/data-table-row-actions";
import { DataTablePagination } from "@/components/data-tables/data-table-pagination";

import { IClient } from "@/@types/client";
import { IDesignation } from "@/@types/designation";
import { IOffice } from "@/@types/office";

export default function AdminClientsPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const defaultData = useMemo(() => [], []);

  const clientQueryKey = ["clients", pagination, sorting, columnFilters];

  const dataQuery = useQuery({
    queryKey: clientQueryKey,
    queryFn: async () => {
      let sortValue = "";
      let data = { rows: [], pageCount: 0, rowCount: 0 };

      let url = `/api/clients/`;
      url += `?page=${pagination.pageIndex + 1}`;
      url += `&limit=${pagination.pageSize}`;
      url += `&includes=all`;

      if (sorting.length > 0) {
        sorting.forEach((sort) => {
          sortValue = sort.desc ? "-" + sort.id : sort.id;
          url += `&sort=${sortValue}`;
        });
      }

      if (columnFilters.length > 0) {
        columnFilters.forEach((filter) => {
          if (filter.value && filter.value !== " ") {
            url += `&${filter.id}=${filter.value}`;
          }
        });
      }

      await api.get(url).then((response) => {
        data.rows = response.data?.results;
        data.pageCount = response.data?.totalPages;
        data.rowCount = response.data?.total;
      });

      return data;
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationKey: clientQueryKey,
    mutationFn: async (id: string) => {
      return await api.delete(`/api/clients/${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKey });
    },
  });

  const columns: ColumnDef<IClient>[] = useMemo<ColumnDef<IClient>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="firstName"
            title="First name"
          />
        ),
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="lastName"
            title="Last name"
          />
        ),
      },
      {
        accessorKey: "designation",
        header: ({ column }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="designation"
            title="Position title"
          />
        ),
        cell: ({ row }) => {
          const designation = row.getValue("designation") as IDesignation;
          if (!designation) {
            return null;
          }
          return (
            <div className="flex w-full items-center">{designation.title}</div>
          );
        },
      },
      {
        accessorKey: "office",
        header: ({ column }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="office"
            title="Office"
          />
        ),
        cell: ({ row }) => {
          const office = row.getValue("office") as IOffice;
          if (!office) {
            return null;
          }
          return (
            <div className="flex w-full items-center">
              <span>{office.alias}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DataTableRowActions
              id={row.original._id}
              name={row.original.firstName + " " + row.original.lastName}
              updatePath={`/admin/clients/${row.original._id}/update`}
              deleteMutation={deleteMutation}
            />
          </div>
        ),
      },
    ],
    []
  );

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
  });

  return (
    <section>
      <h3 className="text-xl font-semibold">Clients</h3>
      <div className="py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate("/admin/clients/create")}
          >
            <ContactRound />
            Create Client
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <ClientDataTable table={table} totalColumns={columns.length} />
        <DataTablePagination table={table} />
      </div>
    </section>
  );
}
