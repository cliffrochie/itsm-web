import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalOnHoldTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalOnHoldTickets(): ThisResponse {
  const [totalOnHoldTickets, setTotalOnHoldTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalOnHoldTickets=true')
        if(response.status === 200) {
          setTotalOnHoldTickets(response.data.totalOnHoldTickets)
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

  return {totalOnHoldTickets, loading, error}
}