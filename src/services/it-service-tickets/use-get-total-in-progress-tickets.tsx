import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalInProgressTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalInProgressTickets(): ThisResponse {
  const [totalInProgressTickets, setTotalInProgressTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalInProgressTickets=true')
        if(response.status === 200) {
          setTotalInProgressTickets(response.data.totalInProgressTickets)
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

  return {totalInProgressTickets, loading, error}
}