import { SetStateAction, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils";

interface IProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
  title: string;
  name?: string;
  data: any[];
}

export default function DataListDialog({
  dialogOpen,
  setDialogOpen,
  title,
  name,
  data,
}: IProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-3 max-h-[500px] overflow-auto overflow-x-hidden">
          <div className="font-semibold text-gray-500">List of data:</div>
          <Table>
            <TableBody className="border rounded-md max-h-24 overflow-auto overflow-x-hidden">
              {data.length > 0 ? (
                data.map((ticket) => (
                  <TableRow
                    key={ticket._id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/it-service-tickets/${ticket._id}/view`)
                    }
                  >
                    <TableCell className="font-medium">
                      {ticket.ticketNo}
                    </TableCell>
                    <TableCell className="font-medium p-5 custom-md:w-48 text-right">
                      <span className="text-gray-500">
                        {ticket.createdAt
                          ? formatDate(ticket.createdAt)
                          : undefined}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="p-5">No tickets yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-24 bg-blue-500 text-white"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
