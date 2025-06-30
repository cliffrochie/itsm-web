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
import { capitalizeFirstLetter } from "@/utils";
import { formatDate } from "@/utils";

interface IProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
  title: string;
  name?: string;
  data: any[];
}

export default function UserListDialog({
  dialogOpen,
  setDialogOpen,
  title,
  name,
  data,
}: IProps) {
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
          <div className="font-semibold text-gray-500">List of users:</div>
          <Table className="">
            <TableBody className="border rounded-md">
              {data.length > 0 ? (
                data.map((user) => (
                  <TableRow key={user._id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {user.firstName
                        ? capitalizeFirstLetter(user.firstName)
                        : ""}
                      &nbsp;
                      {user.middleName
                        ? capitalizeFirstLetter(user.middleName.charAt(0)) +
                          ". "
                        : ""}
                      {user.lastName
                        ? capitalizeFirstLetter(user.lastName)
                        : ""}
                    </TableCell>
                    <TableCell className="font-medium p-5 custom-md:w-48 text-right">
                      <span className="text-gray-500">
                        {user.createdAt
                          ? formatDate(user.createdAt)
                          : undefined}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="p-5">No users yet</TableCell>
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
