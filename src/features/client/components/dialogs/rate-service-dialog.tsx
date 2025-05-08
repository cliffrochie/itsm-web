import { useState, useEffect, SetStateAction, Dispatch, } from "react"
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
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from "axios"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"




interface IRateServiceDialog {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  id: string
  name: string
  serviceEngineerName: string
  updateMutation: UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
}


export default function RateServiceDialog({
  dialogOpen,
  setDialogOpen,
  id,
  serviceEngineerName,
  updateMutation
}: IRateServiceDialog) {
  const [ratingFive, setRatingFive] = useState(false)
  const [ratingFour, setRatingFour] = useState(false)
  const [ratingThree, setRatingThree] = useState(false)
  const [ratingTwo, setRatingTwo] = useState(false)
  const [ratingOne, setRatingOne] = useState(false)
  const [rating, setRating] = useState('n')
  const [ratingComment, setRatingComment] = useState('')

  useEffect(() => {
    console.log(rating)
  }, [rating])

  function starClicked(id: string) {
    switch(id) {
      case 'vs':
        setRatingFive(true)
        setRatingFour(true)
        setRatingThree(true)
        setRatingTwo(true)
        setRatingOne(true)
        setRating('vs')
        break

      case 's':
        setRatingFive(false)
        setRatingFour(true)
        setRatingThree(true)
        setRatingTwo(true)
        setRatingOne(true)
        setRating('s')
        break

      case 'n':
        setRatingFive(false)
        setRatingFour(false)
        setRatingThree(true)
        setRatingTwo(true)
        setRatingOne(true)
        setRating('n')
        break

      case 'd':
        setRatingFive(false)
        setRatingFour(false)
        setRatingThree(false)
        setRatingTwo(true)
        setRatingOne(true)
        setRating('d')
        break

      case 'vd':
        setRatingFive(false)
        setRatingFour(false)
        setRatingThree(false)
        setRatingTwo(false)
        setRatingOne(true)
        setRating('vd')
        break
    }
  }
  

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {/* Optional inline button to trigger the dialog */}
        <button className="hidden">Hidden Trigger</button>
      </DialogTrigger>
      <DialogContent className="custom-xs:w-auto custom-sm:max-w-[550px] fixed top-10 left-1/2 -translate-x-1/2 translate-y-0 w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Service Performance</DialogTitle>
          <DialogDescription>
            <span className="text-sm font-mono">Service Engineer:&nbsp;{serviceEngineerName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="text-sm custom-sm:text-left custom-xs:text-center text-gray-700">Please rate the service or support provided by the assigned service engineer.</div>
          <div className="py-2 flex justify-center">
            <Button variant="ghost" onClick={() => starClicked('vd') }>
              <Star style={{ width: "40px", height: "40px"}} id="vd" fill={ratingOne ? '#000': '#FFF'} />
            </Button>
            <Button variant="ghost" onClick={() => starClicked('d') }>
              <Star style={{ width: "40px", height: "40px"}} id="d" fill={ratingTwo ? '#000': '#FFF'} />
            </Button>
            <Button variant="ghost" onClick={() => starClicked('n') }>
              <Star style={{ width: "40px", height: "40px"}} id="n" fill={ratingThree ? '#000': '#FFF'} />
            </Button>
            <Button variant="ghost" onClick={() => starClicked('s') }>
              <Star style={{ width: "40px", height: "40px"}} id="s" fill={ratingFour ? '#000': '#FFF'} />
            </Button>
            <Button variant="ghost" onClick={() => starClicked('vs') }>
              <Star style={{ width: "40px", height: "40px"}} id="vs" fill={ratingFive ? '#000': '#FFF'} />
            </Button>
          </div>
          <Textarea defaultValue={ratingComment} onChange={(e) => setRatingComment(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-500" onClick={() => {
            updateMutation.mutate(JSON.stringify({
              id: String(id), 
              rating,
              ratingComment, 
            }))
            setDialogOpen(false)
          }}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
