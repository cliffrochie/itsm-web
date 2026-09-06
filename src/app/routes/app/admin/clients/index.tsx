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

import { ClientDataTable, ClientDataTableColumnHeader as DataTableColumnHeader } from "@/features/clients";

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
      const data = { rows: [] as IClient[], pageCount: 0, rowCount: 0 };

      const params: Record<string, unknown> = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      if (columnFilters.length > 0) {
        columnFilters.forEach((filter) => {
          if (filter.value && filter.value !== " ") {
            params[filter.id] = filter.value;
          }
        });
      }

      const response = await api.get('/clients', { params });
      const payload = response.data?.data;
      const meta = response.data?.meta;

      data.rows = Array.isArray(payload) ? payload : (response.data?.results || []);
      data.pageCount = meta?.last_page || response.data?.totalPages || 1;
      data.rowCount = meta?.total || response.data?.total || 0;

      return data;
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationKey: clientQueryKey,
    mutationFn: async (id: string) => {
      return await api.delete(`/clients/${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKey });
    },
  });

  const columns: ColumnDef<IClient>[] = useMemo<ColumnDef<IClient>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: ({ column, table }) => (
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
        header: ({ column, table }) => (
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
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="designation"
            title="Position title"
          />
        ),
        cell: ({ row }) => {
          const client = row.original;
          const designation = client.designation as IDesignation | undefined;
          const title = designation?.name || designation?.title || (client.designationId ? `Designation #${client.designationId}` : "-");
          return (
            <div className="flex w-full items-center">{title}</div>
          );
        },
      },
      {
        accessorKey: "office",
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="office"
            title="Office"
          />
        ),
        cell: ({ row }) => {
          const client = row.original;
          const office = client.office as IOffice | undefined;
          const name = office?.name || office?.code || office?.alias || (client.officeId ? `Office #${client.officeId}` : "-");
          return (
            <div className="flex w-full items-center">
              <span>{name}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const clientId = String(row.original.id ?? row.original._id ?? "");
          return (
            <div className="flex justify-end">
              <DataTableRowActions
                id={clientId}
                name={row.original.firstName + " " + row.original.lastName}
                updatePath={`/admin/clients/${clientId}/update`}
                deleteMutation={deleteMutation}
              />
            </div>
          );
        },
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    rowCount: dataQuery.data?.rowCount,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
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
