import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils';

import { capitalizeFirstLetter } from "@/utils"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import useGetAssignedServiceTickets from "@/hooks/service-engineer--use-get-assigned-service-tickets"
import useGetClosedServiceTickets from '@/hooks/service-engineer--use-get-closed-service-tickets'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function ServiceEngineerPage() {
  const navigate = useNavigate()
  const { assignedTickets } = useGetAssignedServiceTickets()
  const { closedTickets } = useGetClosedServiceTickets()


  return (
    <div className="grid gap-4">
      <section className="grid custom-md:grid-cols-1 gap-4">
        <div className="">
          <div className="py-4 font-semibold">IT Service Tickets</div>
          <div className="flex justify-center w-full">
          <Tabs defaultValue="assignedTickets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="assignedTickets" className="h-10">ASSIGNED TICKETS</TabsTrigger>
              <TabsTrigger value="closedTickets" className="h-10">CLOSED TICKETS</TabsTrigger>
            </TabsList>
            <TabsContent value="assignedTickets">

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Assigned Tickets</CardTitle>
                  <CardDescription>
                    List of tickets assigned to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody className="border rounded-md">
                      { assignedTickets && assignedTickets.length > 0 ? assignedTickets.map((data) => (
                        <TableRow key={data._id} onClick={() => { navigate(`/service-engineer/${data.ticketNo}`) }} className="cursor-pointer">
                          <TableCell className="font-medium p-5 custom-sm:w-60">{data.ticketNo}</TableCell>
                          <TableCell className="font-normal p-5 hidden custom-lg:block">
                            {data.title}
                          </TableCell>
                          <TableCell className="font-medium p-5 custom-sm:w-60 ">
                            <Badge variant="outline" className="hidden custom-md:inline-block border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">
                                {capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium p-5 custom-md:w-48">
                            <span className="text-gray-500">{ data.createdAt ? formatDate(data.createdAt) : undefined }</span>
                          </TableCell>
                        </TableRow>
                      ))
                      : (<TableRow>
                        <TableCell className="p-5">No assigned service tickets</TableCell>
                        </TableRow>)
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </TabsContent>
            <TabsContent value="closedTickets">
              
            <Card className="w-full">
                <CardHeader>
                  <CardTitle>Closed Tickets</CardTitle>
                  <CardDescription>
                    List of tickets that have completed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody className="border rounded-md">
                      { closedTickets && closedTickets.length > 0 ? closedTickets.map((data) => (
                        <TableRow key={data._id} onClick={() => { navigate(`/service-engineer/${data.ticketNo}`) }} className="cursor-pointer">
                          <TableCell className="font-medium p-5 custom-sm:w-60">{data.ticketNo}</TableCell>
                          <TableCell className="font-normal p-5 hidden custom-lg:block">
                            {data.title}
                          </TableCell>
                          <TableCell className="font-medium p-5 custom-sm:w-60 ">
                            <Badge variant="outline" className="hidden custom-md:inline-block border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">
                                {capitalizeFirstLetter(data.serviceStatus ? data.serviceStatus : '')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium p-5 custom-md:w-48">
                            <span className="text-gray-500">{ data.createdAt ? formatDate(data.createdAt) : undefined }</span>
                          </TableCell>
                        </TableRow>
                      ))
                      : (<TableRow>
                        <TableCell className="p-5">No closed service tickets yet</TableCell>
                        </TableRow>)
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>
          </div>
        </div> 
      </section>
    </div>
  )
}
