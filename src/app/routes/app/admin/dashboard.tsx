import { useState } from "react";
import { Ticket, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useTotalServiceStatus,
  useTotalTaskType,
  useTotalEquipmentType,
} from "@/features/tickets/api";
import { useTotalUserRoles } from "@/features/users/api";
import { useClients } from "@/features/clients/api";
import { api } from "@/lib/api-client";
import DataListDialog, { DashboardTicketItem } from "@/components/dialogs/dashboard-data-list-dialog";
import UserListDialog, { DashboardUserItem } from "@/components/dialogs/dashboard-user-list-dialog";

function extractArray<T>(resData: unknown): T[] {
  if (!resData || typeof resData !== "object") return [];
  const obj = resData as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as T[];
  if (Array.isArray(obj.results)) return obj.results as T[];
  if (Array.isArray(resData)) return resData as T[];
  return [];
}

export default function AdminPage() {
  const { data: totalServiceStatuses } = useTotalServiceStatus();
  let serviceStatusesData = [
    { keyName: "totalOpenedTickets", name: "Opened", total: 0 },
    { keyName: "totalAssignedTickets", name: "Assigned", total: 0 },
    { keyName: "totalInProgressTickets", name: "In-Progress", total: 0 },
    { keyName: "totalOnHoldTickets", name: "On-Hold", total: 0 },
    { keyName: "totalEscalatedTickets", name: "Escalated", total: 0 },
    { keyName: "totalCanceledTickets", name: "Canceled", total: 0 },
    { keyName: "totalReOpenedTickets", name: "Re-Opened", total: 0 },
    { keyName: "totalResolvedTickets", name: "Resolved", total: 0 },
    { keyName: "totalClosedTickets", name: "Closed", total: 0 },
  ];
  if (totalServiceStatuses) {
    serviceStatusesData = serviceStatusesData.map((item) => ({
      ...item,
      total:
        (totalServiceStatuses as unknown as Record<string, number>)[item.keyName] || 0,
    }));
  }

  const { data: totalTaskTypes } = useTotalTaskType();
  let taskTypesData = [
    { keyName: "totalIncident", name: "Incident", total: 0 },
    { keyName: "totalServiceRequest", name: "Service Request", total: 0 },
    { keyName: "totalAssetRequest", name: "Asset Request", total: 0 },
    { keyName: "totalMaintenance", name: "Maintenance", total: 0 },
    { keyName: "totalConsultation", name: "Consultation", total: 0 },
    { keyName: "totalAccessibility", name: "Accessibility", total: 0 },
  ];
  if (totalTaskTypes) {
    taskTypesData = taskTypesData.map((item) => ({
      ...item,
      total: (totalTaskTypes as unknown as Record<string, number>)[item.keyName] || 0,
    }));
  }

  const { data: totalEquipmentTypes } = useTotalEquipmentType();
  let equipmentTypesData = [
    { keyName: "totalComputer", name: "Computer", total: 0 },
    { keyName: "totalPrinter", name: "Printer", total: 0 },
    { keyName: "totalScanner", name: "Scanner", total: 0 },
    { keyName: "totalMobileDevice", name: "Mobile Device", total: 0 },
    { keyName: "totalNetworkRelated", name: "Network Related", total: 0 },
    {
      keyName: "totalSoftwareApplication",
      name: "Software Application",
      total: 0,
    },
    { keyName: "totalOthers", name: "Others", total: 0 },
  ];
  if (totalEquipmentTypes) {
    equipmentTypesData = equipmentTypesData.map((item) => ({
      ...item,
      total: (totalEquipmentTypes as unknown as Record<string, number>)[item.keyName] || 0,
    }));
  }

  const { data: totalUserRoles } = useTotalUserRoles();
  let userRolesData = [
    { keyName: "totalAdmin", name: "Admin", total: 0 },
    { keyName: "totalStaff", name: "Service Engineer", total: 0 },
    { keyName: "totalUser", name: "Client", total: 0 },
  ];
  if (totalUserRoles) {
    userRolesData = userRolesData.map((item) => ({
      ...item,
      total: (totalUserRoles as unknown as Record<string, number>)[item.keyName] || 0,
    }));
  }

  const { data: clientsData } = useClients();
  const totalClient = clientsData?.rowCount ?? 0;

  const [dataListDialog, setDataListDialog] = useState(false);
  const [userListDialog, setUserListDialog] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [selectedData, setSelectedData] = useState<DashboardTicketItem[]>([]);
  const [selectedUserData, setSelectedUserData] = useState<DashboardUserItem[]>([]);

  async function handleServiceStatusPopulationClick(data: { name: string }) {
    try {
      const statusMap: Record<string, string> = {
        Opened: "open",
        Assigned: "assigned",
        "In-Progress": "in progress",
        "On-Hold": "on hold",
        Escalated: "escalated",
        Canceled: "canceled",
        "Re-Opened": "reopened",
        Resolved: "resolved",
        Closed: "closed",
      };

      const statusQuery = statusMap[data.name];
      if (statusQuery) {
        const response = await api.get(
          `/api/service-tickets/?serviceStatus=${encodeURIComponent(statusQuery)}&sort=-createdBy`
        );
        const rows = extractArray<DashboardTicketItem>(response.data);
        setDialogTitle(`${data.name} Tickets`);
        setSelectedId(rows[0]?._id ? String(rows[0]._id) : "");
        setSelectedName(rows[0]?.ticketNo || "");
        setSelectedData(rows);
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setDataListDialog(true);
    }
  }

  async function handleTaskTypePopulationClick(data: { name: string }) {
    try {
      const response = await api.get(
        `/api/service-tickets?noPage=true&taskType=${encodeURIComponent(data.name.toLowerCase())}`
      );
      const rows = extractArray<DashboardTicketItem>(response.data);
      setDialogTitle(`${data.name} Tasks`);
      setSelectedId(rows[0]?._id ? String(rows[0]._id) : "");
      setSelectedName(rows[0]?.ticketNo || "");
      setSelectedData(rows);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setDataListDialog(true);
    }
  }

  async function handleEquipmentTypePopulationClick(data: { name: string }) {
    try {
      const eqType = data.name === "Others" ? "software application" : data.name.toLowerCase();
      const response = await api.get(
        `/api/service-tickets?noPage=true&equipmentType=${encodeURIComponent(eqType)}`
      );
      const rows = extractArray<DashboardTicketItem>(response.data);
      setDialogTitle(`${data.name} Equipment Type`);
      setSelectedId(rows[0]?._id ? String(rows[0]._id) : "");
      setSelectedName(rows[0]?.ticketNo || "");
      setSelectedData(rows);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setDataListDialog(true);
    }
  }

  async function handleUserRolePopulationClick(data: { name: string }) {
    try {
      const roleMap: Record<string, string> = {
        Admin: "admin",
        "Service Engineer": "staff",
        Client: "user",
      };

      const roleQuery = roleMap[data.name];
      if (roleQuery) {
        const response = await api.get(`/api/users?role=${roleQuery}&noPage=true`);
        const rows = extractArray<DashboardUserItem>(response.data);
        setDialogTitle(`${data.name} Roles`);
        setSelectedId(rows[0]?._id ? String(rows[0]._id) : "");
        setSelectedName(rows[0]?.lastName || "");
        setSelectedUserData(rows);
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setUserListDialog(true);
    }
  }

  return (
    <section className="grid gap-4">
      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              TOTAL TICKETS
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalServiceStatuses?.totalTickets || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              TOTAL USERS
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalUserRoles?.total || totalUserRoles?.totalUsers || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              CLIENT POPULATION
            </CardTitle>
            <Users className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClient || 0}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid custom-lg:grid-cols-3 custom-md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              Ticket service status population
            </CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer
              width={"100%"}
              height={220}
              style={{ cursor: "pointer" }}
            >
              <BarChart data={serviceStatusesData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  interval={0}
                />
                <Tooltip />
                <Bar
                  dataKey="total"
                  fill="#8bb2f0"
                  radius={[0, 0, 0, 0]}
                  onClick={handleServiceStatusPopulationClick}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              Ticket task type population
            </CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={taskTypesData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  interval={0}
                />
                <Tooltip />
                <Bar
                  dataKey="total"
                  fill="#8fc98d"
                  radius={[0, 0, 0, 0]}
                  onClick={handleTaskTypePopulationClick}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              Ticket equipment type population
            </CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={equipmentTypesData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  interval={0}
                />
                <Tooltip />
                <Bar
                  dataKey="total"
                  fill="#deb7ab"
                  radius={[0, 0, 0, 0]}
                  onClick={handleEquipmentTypePopulationClick}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mono flex justify-between text-gray-500">
              User roles population
            </CardTitle>
          </CardHeader>
          <CardContent className="h-70">
            <ResponsiveContainer width={"100%"} height={220}>
              <BarChart data={userRolesData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  interval={0}
                />
                <Tooltip />
                <Bar
                  dataKey="total"
                  fill="#e8a0e4"
                  radius={[0, 0, 0, 0]}
                  onClick={handleUserRolePopulationClick}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <DataListDialog
        dialogOpen={dataListDialog}
        setDialogOpen={setDataListDialog}
        title={dialogTitle}
        id={selectedId}
        name={selectedName}
        data={selectedData}
      />
      <UserListDialog
        dialogOpen={userListDialog}
        setDialogOpen={setUserListDialog}
        title={dialogTitle}
        id={selectedId}
        name={selectedName}
        data={selectedUserData}
      />
    </section>
  );
}
