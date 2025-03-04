import { useState } from "react"
import { useParams } from "react-router-dom"
import { capitalizeFirstLetter } from "@/utils"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { IServiceTicket } from "@/@types/service-ticket"

export default function ClientTicketView() {
  const [serviceTicket, setServiceTicket] = useState<IServiceTicket | undefined>(undefined)
  const params = useParams()

  return (
    <div className="grid gap-4">
      <section className="grid mx-4 custom-md:grid-cols-1 gap-4 custom-xl:mx-72 custom-lg:mx-60 custom-md:mx-36 custom-sm:mx-20">
        <div className="mt-4">
          <div className="w-full">
            <div className="text-xl font-semibold m-0 mb-2">
              <table className="">
                <tbody>
                  <tr>
                    <td className="font-bold text-2xl" width="150">Ticket no:</td>
                    <td className="font-bold text-2xl ml-4">{params.ticketNo}</td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-600">Service Status:</td>
                    <td className="text-sm text-gray-600">{serviceTicket ? capitalizeFirstLetter(String(serviceTicket.serviceStatus)) : ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
