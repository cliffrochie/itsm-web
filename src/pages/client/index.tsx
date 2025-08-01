import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { capitalizeFirstLetter } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IServiceTicket } from "@/@types/service-ticket";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/hooks/use-api";
import { formatDate } from "@/utils";
import useAuthUser from "@/hooks/user--use-auth-user";

export default function ClientPage() {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState<IServiceTicket[] | []>([]);

  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const clientKey = ["clientRequestTracker", search];

  const dataQuery = useQuery({
    queryKey: clientKey,
    queryFn: async () => {
      let data: any[] = [];
      let url = "";
      if (search) {
        url = `/api/service-tickets/?noPage=true&ticketNo=${search}&createdBy=${authUser?._id}`;
      } else {
        url = `/api/service-tickets/requested`;
      }

      await api.get(url).then((response) => {
        data = response.data;
      });

      return data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (dataQuery.data) {
      setTickets(dataQuery.data);
    }

    // console.log(dataQuery.data)
  }, [dataQuery.data]);

  return (
    <div className="">
      <div className="">
        <div className="pb-4 font-semibold">REQUEST TRACKER</div>
        <div className="flex justify-center w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Requests</CardTitle>
              <CardDescription>
                List of requested tickets created by you, or the one you
                searched.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-2 custom-md:w-1/2">
                <div className="relative w-full">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                  <Input
                    className="pl-10"
                    placeholder="Search ticket"
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-40"
                  onClick={() => navigate("/client/ticket-form")}
                >
                  <Plus /> Create Request
                </Button>
              </div>
              <Table>
                <TableBody className="border">
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <TableRow
                        key={ticket._id}
                        className="cursor-pointer"
                        onClick={() => navigate("/client/" + ticket.ticketNo)}
                      >
                        <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-44">
                          {ticket.ticketNo}
                        </TableCell>
                        <TableCell className="font-medium p-5">
                          <Badge
                            variant="outline"
                            className="border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80"
                          >
                            {ticket.serviceStatus
                              ? capitalizeFirstLetter(ticket.serviceStatus)
                              : ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium p-5 custom-md:w-48">
                          <span className="text-gray-500 hidden custom-md:block text-right">
                            {ticket.createdAt
                              ? formatDate(ticket.createdAt)
                              : undefined}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="">
                      <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-44">
                        No requested tickets found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
