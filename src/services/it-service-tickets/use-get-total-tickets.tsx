import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 




interface Tickets {
  totalTickets: number
  totalOpenedTickets: number
  totalInProgressTickets: number
  totalOnHoldTickets: number
  totalEscalatedTickets: number
  totalCanceledTickets: number
  totalReOpenedTickets: number
  totalResolvedTickets: number
  totalClosedTickets: number
}

interface ThisResponse {
  tickets?: Tickets
  loading: boolean
  error?: object | string | undefined 
}

const queryParams = [
  'totalOpenedTickets',
  'totalInProgressTickets',
  'totalOnHoldTickets',
  'totalEscalatedTickets',
  'totalCanceledTickets',
  'totalReOpenedTickets',
  'totalResolvedTickets',
  'totalClosedTickets',
]


export default function useGetTotalTickets(): ThisResponse {
  const [tickets, setTickets] = useState<Tickets | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = '/api/service-tickets/total/?totalTickets=true'
  queryParams.forEach(a => url += `&${a}=true`)

  // console.log(url)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        
        const response = await api.get(url)
        if(response.status === 200) {
          setTickets(response.data)
        }
      }
      catch(error) {

        setError(handleAxiosError(error))
      }
      finally {
        setLoading(false)
      }
    }

    getTotalTickets()
  }, [])

  return {tickets, loading, error}
}