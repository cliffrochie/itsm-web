import api from '@/hooks/use-api'
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
  totalServiceStatuses?: Tickets
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


export default function useGetTotalServiceStatus(): ThisResponse {
  const [totalServiceStatuses, setServiceStatuses] = useState<Tickets | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = '/api/service-tickets/total-service-status/?totalTickets=true'
  queryParams.forEach(a => url += `&${a}=true`)

  // console.log(url)

  useEffect(() => {
    async function getTotalServiceStatus() {
      try {
        setLoading(true)
        
        const response = await api.get(url)
        if(response.status === 200) {
          setServiceStatuses(response.data)
        }
      }
      catch(error) {

        setError(handleAxiosError(error))
      }
      finally {
        setLoading(false)
      }
    }

    getTotalServiceStatus()
  }, [])

  return {totalServiceStatuses, loading, error}
}