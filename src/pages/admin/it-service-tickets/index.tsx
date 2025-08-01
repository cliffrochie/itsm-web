import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/hooks/use-api";
import { IServiceTicket } from "@/@types/service-ticket";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { ServiceTicketDataTableColumnHeader } from "@/components/data-tables/it-service-ticket--data-table-column-header";
import { ServiceTicketDataTable } from "@/components/data-tables/it-service-ticket--data-table";
import { DataTableRowActions } from "@/components/data-tables/data-table-row-actions";
import { DataTableViewOptions } from "@/components/data-tables/data-table-view-options";
import { DataTablePagination } from "@/components/data-tables/data-table-pagination";
import { isClientInterface } from "@/@types/client";
import { isUserInterface } from "@/@types/user";
import { serviceStatuses } from "@/data/service-status";
import { priorities } from "@/data/priority";
import { capitalizeFirstLetter } from "@/utils";

export default function AdminITServiceTicketsPage() {
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
  const serviceTicketQueryKey = [
    "serviceTicket",
    pagination,
    sorting,
    columnFilters,
  ];

  const dataQuery = useQuery({
    queryKey: serviceTicketQueryKey,
    queryFn: async () => {
      let sortValue = "";
      let data = { rows: [], pageCount: 0, rowCount: 0 };

      let url = `/api/service-tickets/`;
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

  useMutation({
    mutationKey: serviceTicketQueryKey,
    mutationFn: async (id: string) => {
      return await api.delete(`/api/service-tickets/${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: serviceTicketQueryKey });
    },
  });

  // console.log(dataQuery.data)

  const columns: ColumnDef<IServiceTicket>[] = useMemo<
    ColumnDef<IServiceTicket>[]
  >(
    () => [
      {
        accessorKey: "ticketNo",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="ticketNo"
            title="Ticket No."
          />
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="title"
            title="Title"
          />
        ),
      },
      {
        accessorKey: "serviceStatus",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="serviceStatus"
            title="Service Status"
          />
        ),
        cell: ({ row }) => {
          const serviceStatus = serviceStatuses.find(
            (serviceStatus) =>
              serviceStatus.value === row.getValue("serviceStatus")
          );
          if (!serviceStatus) {
            return null;
          }
          return (
            <div className="flex items-center">
              {serviceStatus.icon && (
                <serviceStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{serviceStatus.label}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="priority"
            title="Service Status"
          />
        ),
        cell: ({ row }) => {
          const priority = priorities.find(
            (priority) => priority.value === row.getValue("priority")
          );
          if (!priority) {
            return null;
          }
          return (
            <div className="flex items-center">
              {priority.icon && (
                <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{priority.label}</span>
            </div>
          );
        },
      },

      {
        accessorKey: "client",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="client"
            title="Client"
          />
        ),
        cell: ({ row }) => {
          const firstName = isClientInterface(row.original.client)
            ? row.original.client.firstName
            : "";
          const lastName = isClientInterface(row.original.client)
            ? row.original.client.lastName
            : "";
          const fullName =
            String(firstName).charAt(0).toUpperCase() +
            String(firstName).slice(1).toLowerCase() +
            " " +
            String(lastName).charAt(0).toUpperCase() +
            String(lastName).slice(1).toLowerCase();

          return (
            <div className="flex w-full items-center">
              <span>{fullName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "serviceEngineer",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="serviceEngineer"
            title="Service Engineer"
          />
        ),
        cell: ({ row }) => {
          const firstName = isUserInterface(row.original.serviceEngineer)
            ? row.original.serviceEngineer.firstName
            : "";
          const lastName = isUserInterface(row.original.serviceEngineer)
            ? row.original.serviceEngineer.lastName
            : "";
          const fullName =
            capitalizeFirstLetter(firstName) +
            " " +
            capitalizeFirstLetter(lastName);

          return (
            <div className="flex w-full items-center">
              <span>{fullName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <ServiceTicketDataTableColumnHeader
            table={table}
            column={column}
            accessorKey="createdAt"
            title="Date Created"
          />
        ),
        cell: ({ row }) => {
          const createdAt = new Date(row.getValue("createdAt"));

          const formattedDate = createdAt.toLocaleDateString("en-US", {
            timeZone: "Asia/Singapore",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Set to false for 24-hour format
          });

          return (
            <div className="flex items-center">
              <span>{formattedDate}</span>
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
              name={row.original.ticketNo}
              viewPath={`/admin/it-service-tickets/${row.original._id}/view`}
              updatePath={`/admin/it-service-tickets/${row.original._id}/update`}
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
      <h3 className="text-xl font-semibold">IT Service Tickets</h3>
      <div className="py-5">
        <div className="flex justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex"
            onClick={() => navigate("/admin/it-service-tickets/create")}
          >
            <Briefcase />
            Create Service Ticket
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <ServiceTicketDataTable table={table} totalColumns={columns.length} />
        <DataTablePagination table={table} />
      </div>
    </section>
  );
}
