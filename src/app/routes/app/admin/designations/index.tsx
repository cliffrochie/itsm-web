import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";
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

import { api } from "@/lib/api-client";

import { DesignationDataTable, DesignationDataTableColumnHeader as DataTableColumnHeader } from "@/features/designations";

import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options";
import { DataTableRowActions } from "@/components/data-tables/data-table-row-actions";
import { DataTablePagination } from "@/components/data-tables/data-table-pagination";

import { IDesignation } from "@/@types/designation";

export default function AdminDesignationsPage() {
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

  const designationQueryKey = [
    "designations",
    pagination,
    sorting,
    columnFilters,
  ];

  const dataQuery = useQuery({
    queryKey: designationQueryKey,
    queryFn: async () => {
      let sortValue = "";
      const data = { rows: [], pageCount: 0, rowCount: 0 };

      let url = `/api/designations/`;
      url += `?page=${pagination.pageIndex + 1}`;
      url += `&limit=${pagination.pageSize}`;

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
        const payload = response.data?.data;
        const meta = response.data?.meta;

        data.rows = Array.isArray(payload)
          ? payload
          : (response.data?.results || []);
        data.pageCount = meta?.last_page || response.data?.totalPages || 1;
        data.rowCount =
          meta?.total ||
          response.data?.total ||
          (Array.isArray(payload) ? payload.length : 0);
      });

      return data;
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationKey: designationQueryKey,
    mutationFn: async (id: string) => {
      return await api.delete(`/api/designations/${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: designationQueryKey });
    },
  });

  const columns: ColumnDef<IDesignation>[] = useMemo<ColumnDef<IDesignation>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column, table }) => (
          <DataTableColumnHeader
            table={table}
            column={column}
            accessorKey="name"
            title="Position title"
          />
        ),
        cell: ({ row }) => (
          <div>{row.original.name || row.original.title || "-"}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DataTableRowActions
              id={String(row.original._id || row.original.id || "")}
              name={row.original.name || row.original.title || ""}
              updatePath={`/admin/designations/${row.original._id || row.original.id}/update`}
              deleteMutation={deleteMutation}
            />
          </div>
        ),
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
      <h3 className="text-xl font-semibold">Designations</h3>
      <div className="py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate("/admin/designations/create")}
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
  );
}
