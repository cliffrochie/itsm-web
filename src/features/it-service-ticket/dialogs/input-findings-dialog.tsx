import { useState, useEffect, SetStateAction, Dispatch } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from "axios"


interface IInputFindings {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id?: string
  currentValue?: string
  name?: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export default function InputFindingsDialog({
  dialogOpen, 
  setDialogOpen,
  id,
  currentValue,
  name,
  updateMutation
}: IInputFindings) {
  const [findings, setFindings] = useState<string | undefined>('')

  useEffect(() => {
    if(currentValue) {
      setFindings(currentValue)
    }
  }, [dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Findings</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">{name}</span>
          </DialogDescription>
        </DialogHeader>
          <div className="grid gap-4 py-3">
            <Label>Defects found</Label>
            <Input value={findings} onChange={ (e) => setFindings(e.target.value) } />
          </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: String(id), 
              name: name, 
              findings: findings
            }))
            setDialogOpen(false)
          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}