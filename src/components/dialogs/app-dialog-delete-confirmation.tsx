import { Dispatch, SetStateAction } from "react"
import { UseMutationResult } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slide, toast } from "react-toastify"


interface IDialogConfirmation {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  name: string
  id: string
  deleteMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}

export default function AppDialogDeleteConfirmation({
  dialogOpen,
  setDialogOpen,
  name,
  id,
  deleteMutation
}: IDialogConfirmation) {

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] absolute top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Delete?</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="mb-3">
          Delete <span className="font-semibold text-red-500">{name ? name : 'this data'}</span>?
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false) }>No</Button>
            <Button className="bg-red-600" onClick={() => {
              deleteMutation.mutate(id)
              setDialogOpen(false)

              toast.success(`${name} is deleted successfully.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
                className: 'text-sm',
              });
            }}>Yes</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}