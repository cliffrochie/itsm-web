import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils';
import { capitalizeFirstLetter } from "@/utils"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import getAssignedServiceTickets from "@/features/service-engineer/hooks/get-assigned-service-tickets"




export default function ServiceEngineerPage() {
  const navigate = useNavigate()
  const { assignedTickets } = getAssignedServiceTickets()

  return (
    <div className="grid gap-4">
      <section className="grid custom-md:grid-cols-1 gap-4">
        <div className="">
          <div className="py-4 font-semibold">ASSIGNED  TICKETS</div>
          <div className="flex justify-center w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>
                  List of tickets assigned for you.
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
                      <TableCell className="font-medium p-5">No assigned service tickets</TableCell>
                      </TableRow>)
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div> 
      </section>
    </div>
  )
}
