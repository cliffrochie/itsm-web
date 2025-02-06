import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, TicketCheck } from "lucide-react";

export default function ServiceEngineerPage() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              Opened tickets
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              In-progress tickets
            </CardTitle>
            <Ticket className="text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex justify-between text-gray-500">
              Closed tickets
            </CardTitle>
            <TicketCheck className="text-gray-500"  />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
          </CardContent>
        </Card>
       
      </div>
    </div>
  )
}
