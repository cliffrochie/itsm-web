import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalReOpenedTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalReOpenedTickets(): ThisResponse {
  const [totalReOpenedTickets, setTotalReOpenedTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalReOpenedTickets=true')
        if(response.status === 200) {
          setTotalReOpenedTickets(response.data.totalReOpenedTickets)
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

  return {totalReOpenedTickets, loading, error}
}