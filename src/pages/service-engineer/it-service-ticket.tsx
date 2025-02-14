import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


let invoices = [
  {
    invoice: "INV-1",
  },
]

for(let i=2; i<50; i++) {
  invoices.push({ invoice: `INV-${i}` })
}

export default function ServiceEngineerITServiceTicket() {
  return (
    <div>
      <div className="grid gap-4">
        <h3>Service Engineer IT Service Ticket Page</h3>
        <div className="m-5">
          <div className="rounded-md border mb-3 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium p-5">{invoice.invoice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
