import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Error403Page() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex flex-col justify-center h-screen items-center gap-4">
        <h3>Error 403: Unauthorized Access!</h3>
        <Button variant="outline" onClick={() => navigate('/') }>Go back</Button>
      </div>
    </>
  )
}
