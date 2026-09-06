import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IServiceTicket } from "@/@types/service-ticket";
import { Circle, LucideIcon } from "lucide-react";
import { taskTypes } from "@/data/task-types";
import { equipmentTypes } from "@/data/equipment-types";
import { IClient } from "@/@types/client";
import { IUser } from "@/@types/user";
import { Undo2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IServiceTicketHistory } from "@/@types/service-ticket-history";
import { Button } from "@/components/ui/button";
import { RateServiceDialog } from "@/features/tickets";
import { Slide, toast } from "react-toastify";

export default function ClientTicketView() {
  const [dateRequested, setDateRequested] = useState("");
  const [rateServiceDialog, setRateServiceDialog] = useState(false);
  const [serviceTicket, setServiceTicket] = useState<
    IServiceTicket | undefined
  >(undefined);
  const [serviceEngineerFullName, setServiceEngineerFullName] = useState("");
  const [clientFullName, setClientFullName] = useState("");
  const [createdByFullName, setCreatedByFullName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [TaskTypeIcon, setTaskTypeIcon] = useState<LucideIcon>(() => Circle);
  const [EquipmentTypeIcon, setEquipmentTypeIcon] = useState<LucideIcon>(
    () => Circle
  );
  const [displayRateServiceButton, setDisplayRateServiceButton] =
    useState(false);

  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = ["clientTicket"];

  useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await api.get(`/service-tickets`, {
        params: { search: params.ticketNo, limit: 1 },
      });
      const list = response.data?.data || response.data || [];
      if (list.length > 0) {
        const ticketId = list[0].id ?? list[0]._id;
        const detailRes = await api.get(`/service-tickets/${ticketId}`);
        const fullTicket = detailRes.data?.data || detailRes.data;
        setServiceTicket(fullTicket);
        return 1;
      }
      return 0;
    },
    placeholderData: keepPreviousData,
  });

  const serviceTicketHistoryQuery = useQuery<IServiceTicketHistory[]>({
    queryKey: ["serviceTicketHistory", serviceTicket?.id, serviceTicket?._id],
    queryFn: async () => {
      if (serviceTicket?.histories) {
        return serviceTicket.histories;
      }
      return [];
    },
    enabled: Boolean(serviceTicket),
  });

  const rateServiceMutation = useMutation({
    mutationKey: ["rateServiceMutation"],
    mutationFn: async (data: string) => {
      const parsedData = JSON.parse(data);
      const ratingMap: Record<string, number> = {
        vs: 5,
        s: 4,
        n: 3,
        d: 2,
        vd: 1,
      };
      const numericRating =
        typeof parsedData.rating === "number"
          ? parsedData.rating
          : ratingMap[parsedData.rating] || Number(parsedData.rating) || 3;
      return await api.post(`/service-tickets/${parsedData.id}/feedback`, {
        rating: numericRating,
        ratingComment: parsedData.ratingComment || null,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success(`Service rated successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        className: "text-sm",
      });
    },
  });

  useEffect(() => {
    if (serviceTicket && serviceTicket.createdAt) {
      const result = new Date(serviceTicket.createdAt);
      const formattedDate = result.toLocaleDateString("en-US", {
        timeZone: "Asia/Singapore",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Set to false for 24-hour format
      });
      setDateRequested(formattedDate);
    }

    if (serviceTicket?.taskType) {
      const obj = taskTypes.find((t) => t.value === serviceTicket.taskType);
      if (obj) {
        setTaskTypeIcon(() => obj.icon);
      }
    }

    if (serviceTicket?.equipmentType) {
      const obj = equipmentTypes.find(
        (e) => e.value === serviceTicket.equipmentType
      );
      if (obj) {
        setEquipmentTypeIcon(() => obj.icon);
      }
    }

    if (serviceTicket?.client && typeof serviceTicket.client === "object") {
      const obj = serviceTicket.client as IClient;
      setClientFullName(
        [
          capitalizeFirstLetter(obj.firstName),
          obj.middleName
            ? `${capitalizeFirstLetter(obj.middleName).charAt(0)}.`
            : "",
          capitalizeFirstLetter(obj.lastName),
          obj.extensionName ? capitalizeFirstLetter(obj.extensionName) : "",
        ]
          .filter(Boolean)
          .join(" ")
      );

      const officeObj = obj.office;
      if (officeObj) {
        const officeId = typeof officeObj === "object" ? (officeObj.id ?? officeObj._id) : officeObj;
        api.get(`/offices/${officeId}`).then((response) => {
          const off = response.data?.data ?? response.data;
          setOfficeName(off?.code || off?.alias || off?.name || "");
        });
      }
    } else if (serviceTicket?.clientId) {
      api.get(`/clients/${serviceTicket.clientId}`).then((response) => {
        const client: IClient = response.data?.data ?? response.data;
        if (client) {
          setClientFullName(
            [
              capitalizeFirstLetter(client.firstName),
              client.middleName
                ? `${capitalizeFirstLetter(client.middleName).charAt(0)}.`
                : "",
              capitalizeFirstLetter(client.lastName),
              client.extensionName
                ? capitalizeFirstLetter(client.extensionName)
                : "",
            ]
              .filter(Boolean)
              .join(" ")
          );

          if (client.officeId) {
            api.get(`/offices/${client.officeId}`).then((offRes) => {
              const off = offRes.data?.data ?? offRes.data;
              setOfficeName(off?.code || off?.alias || off?.name || "");
            });
          }
        }
      });
    }

    if (
      serviceTicket?.serviceEngineer &&
      typeof serviceTicket.serviceEngineer === "object"
    ) {
      const obj = serviceTicket.serviceEngineer as IUser;
      setServiceEngineerFullName(
        [
          capitalizeFirstLetter(obj.firstName),
          obj.middleName
            ? `${capitalizeFirstLetter(obj.middleName).charAt(0)}.`
            : "",
          capitalizeFirstLetter(obj.lastName),
        ]
          .filter(Boolean)
          .join(" ")
      );
    } else if (serviceTicket?.serviceEngineerId) {
      api.get(`/users/${serviceTicket.serviceEngineerId}`).then((uRes) => {
        const u = uRes.data?.data ?? uRes.data;
        if (u) {
          setServiceEngineerFullName(
            [
              capitalizeFirstLetter(u.firstName),
              u.middleName
                ? `${capitalizeFirstLetter(u.middleName).charAt(0)}.`
                : "",
              capitalizeFirstLetter(u.lastName),
            ]
              .filter(Boolean)
              .join(" ")
          );
        }
      });
    }

    if (
      serviceTicket?.createdBy &&
      typeof serviceTicket.createdBy === "object"
    ) {
      const obj = serviceTicket.createdBy as IUser;
      setCreatedByFullName(
        [
          capitalizeFirstLetter(obj.firstName),
          obj.middleName
            ? `${capitalizeFirstLetter(obj.middleName).charAt(0)}.`
            : "",
          capitalizeFirstLetter(obj.lastName),
        ]
          .filter(Boolean)
          .join(" ")
      );
    } else if (serviceTicket?.createdById) {
      api.get(`/users/${serviceTicket.createdById}`).then((uRes) => {
        const u = uRes.data?.data ?? uRes.data;
        if (u) {
          setCreatedByFullName(
            [
              capitalizeFirstLetter(u.firstName),
              u.middleName
                ? `${capitalizeFirstLetter(u.middleName).charAt(0)}.`
                : "",
              capitalizeFirstLetter(u.lastName),
            ]
              .filter(Boolean)
              .join(" ")
          );
        }
      });
    }

    console.log(serviceTicket?.serviceStatus);

    if (
      serviceTicket?.serviceStatus === "resolved" ||
      serviceTicket?.serviceStatus === "closed"
    ) {
      setDisplayRateServiceButton(true);
    }
  }, [serviceTicket]);

  return (
    <div className="">
      <div className="">
        <div className="w-full">
          <div className="flex justify-between items-center text-xl font-semibold m-0 mb-6">
            <div className="flex custom-xs:flex-col custom-sm:flex-row custom-xs:items-start custom-sm:items-center custom-xs:gap-2 custom-sm:gap-7">
              <div>
                <div className="font-bold text-lg">{params.ticketNo}</div>
                <div className="text-sm text-gray-600">
                  Status:&nbsp;&nbsp;
                  {serviceTicket
                    ? capitalizeFirstLetter(String(serviceTicket.serviceStatus))
                    : ""}
                  ,&nbsp;&nbsp;
                  {serviceTicket
                    ? capitalizeFirstLetter(String(serviceTicket.priority))
                    : "No"}{" "}
                  Priority
                </div>
              </div>
              <div className="">
                {serviceTicket?.rating === "vs" && (
                  <div className="flex">
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                  </div>
                )}
                {serviceTicket?.rating === "s" && (
                  <div className="flex">
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} />
                  </div>
                )}
                {serviceTicket?.rating === "n" && (
                  <div className="flex">
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} />
                    <Star size={15} />
                  </div>
                )}
                {serviceTicket?.rating === "d" && (
                  <div className="flex">
                    <Star size={15} fill="#000" />
                    <Star size={15} fill="#000" />
                    <Star size={15} />
                    <Star size={15} />
                    <Star size={15} />
                  </div>
                )}
                {serviceTicket?.rating === "vd" && (
                  <div className="flex">
                    <Star size={15} fill="#000" />
                    <Star size={15} />
                    <Star size={15} />
                    <Star size={15} />
                    <Star size={15} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              {displayRateServiceButton && serviceTicket?.rating === "" && (
                <Button
                  variant="ghost"
                  className="bg-blue-500 text-white"
                  onClick={() => setRateServiceDialog(true)}
                >
                  <Star fill="#FFF" /> Rate
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/client")}>
                <Undo2 />
                Back
              </Button>
            </div>
          </div>
          <div className="grid gap-4 custom-lg:grid-cols-2 custom-md:grid-cols-1 ">
            <div className="flex flex-col gap-4">
              <Card className="w-full h-auto">
                <CardHeader>
                  <CardTitle>IT Service Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <div className="flex gap-4 flex-col">
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Date & Time Requested:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span className="text-sm">{dateRequested}</span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Title:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span className="text-sm">
                          {serviceTicket ? serviceTicket.title : ""}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Type:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <TaskTypeIcon size={16} />
                        <span className="text-sm">
                          {serviceTicket
                            ? capitalizeFirstLetter(serviceTicket.taskType)
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Equipment:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <EquipmentTypeIcon size={16} />
                        <span className="text-sm">
                          {serviceTicket
                            ? capitalizeFirstLetter(serviceTicket.equipmentType || "")
                            : ""}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Requestor Name:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span
                          className={
                            clientFullName ? "text-sm" : "text-sm text-red-500"
                          }
                        >
                          {clientFullName ? clientFullName : "Unassigned"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Requestor Office:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span
                          className={
                            officeName ? "text-sm" : "text-sm text-red-500"
                          }
                        >
                          {officeName ? officeName : "Unassigned"}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="grid gap-2">
                      <span className="text-sm text-gray-500 font-semibold">
                        Nature of Work / Problem
                      </span>
                      <div className="border p-3 rounded-md text-sm bg-gray-100 max-h-24 overflow-auto overflow-x-hidden">
                        {serviceTicket ? serviceTicket.natureOfWork : ""}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <span className="text-sm text-gray-500 font-semibold">
                        Findings
                      </span>
                      <div className="border p-3 min-h-12 rounded-md text-sm bg-gray-100">
                        {serviceTicket ? serviceTicket.defectsFound : ""}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <span className="text-sm text-gray-500 font-semibold">
                        Service Rendered / Action Taken
                      </span>
                      <div className="border p-3 min-h-12 rounded-md text-sm bg-gray-100">
                        {serviceTicket ? serviceTicket.serviceRendered : ""}
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Service Engineer:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span
                          className={
                            serviceEngineerFullName
                              ? "text-sm"
                              : "text-sm text-red-500"
                          }
                        >
                          {serviceEngineerFullName
                            ? serviceEngineerFullName
                            : "Unassigned"}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex gap-4 justify-between">
                      <div className="text-sm">Created by:</div>
                      <div className="font-bold flex justify-between gap-2">
                        <span
                          className={
                            createdByFullName
                              ? "text-sm"
                              : "text-sm text-red-500"
                          }
                        >
                          {createdByFullName ? createdByFullName : "Unassigned"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="custom-sm:col-span-1 min-h-[500px] h-auto overflow-hidden">
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent className="h-[420px] overflow-y-auto overflow-x-auto">
                <div className="grid grid-cols-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-5">Date</TableHead>
                        <TableHead className="w-20">Time</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceTicketHistoryQuery.data &&
                        serviceTicketHistoryQuery.data.map((history, idx) => (
                          <TableRow key={history.id ?? history._id ?? idx}>
                            <TableCell>{history.date}</TableCell>
                            <TableCell>{history.time}</TableCell>
                            <TableCell>{history.details || history.action || "Status updated"}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <RateServiceDialog
        dialogOpen={rateServiceDialog}
        setDialogOpen={setRateServiceDialog}
        id={serviceTicket ? String(serviceTicket.id ?? serviceTicket._id ?? "") : ""}
        name={serviceTicket ? serviceTicket.ticketNo : ""}
        serviceEngineerName={serviceEngineerFullName}
        updateMutation={rateServiceMutation}
      />
    </div>
  );
}
