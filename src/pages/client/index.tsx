import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { capitalizeFirstLetter } from "@/utils"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function ClientPage() {
  const navigate = useNavigate()
  return (
    <div className="grid gap-4">
      <section className="grid mx-4 custom-md:grid-cols-1 gap-4 custom-xl:mx-72 custom-lg:mx-60 custom-md:mx-36 custom-sm:mx-20">
        <div className="mt-4">
          <div className="py-4 font-semibold">REQUEST TRACKER</div>
          <div className="flex justify-center w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>
                  List of requested tickets created by you.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2 custom-md:w-1/2"> 
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                    <Input className="pl-10" placeholder="Search other ticket no." />
                  </div>
                  <Button variant="outline" className="w-40" onClick={() => navigate('/client/ticket-form') }><Plus /> Create a Request</Button>
                </div>
                <Table>
                  <TableBody className="border ">
                    <TableRow className="cursor-pointer" onClick={() => alert('clicked') }>
                      <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-44">ITSM-250303-001</TableCell>
                      <TableCell className="font-medium p-5"><Badge variant="outline" className="border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">Assigned</Badge></TableCell>
                    </TableRow>
                    <TableRow className="cursor-pointer" onClick={() => alert('clicked') }>
                      <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-44">ITSM-250303-001</TableCell>
                      <TableCell className="font-medium p-5"><Badge variant="outline" className="border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">Assigned</Badge></TableCell>
                    </TableRow>
                    <TableRow className="cursor-pointer" onClick={() => alert('clicked') }>
                      <TableCell className="font-medium p-5 custom-sm:w-auto custom-md:w-44">ITSM-250303-001</TableCell>
                      <TableCell className="font-medium p-5"><Badge variant="outline" className="border-transparent bg-gray-500 text-primary-foreground shadow hover:bg-primary/80">Assigned</Badge></TableCell>
                    </TableRow>
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
