import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalResolvedTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalResolvedTickets(): ThisResponse {
  const [totalResolvedTickets, setTotalResolvedTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalResolvedTickets=true')
        if(response.status === 200) {
          setTotalResolvedTickets(response.data.totalResolvedTickets)
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

  return {totalResolvedTickets, loading, error}
}