import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalClosedTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalClosedTickets(): ThisResponse {
  const [totalClosedTickets, setTotalClosedTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalClosedTickets=true')
        if(response.status === 200) {
          setTotalClosedTickets(response.data.totalClosedTickets)
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

  return {totalClosedTickets, loading, error}
}