import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalOpenedTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalOpenedTickets(): ThisResponse {
  const [totalOpenedTickets, setTotalOpenedTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalOpenedTickets=true')
        if(response.status === 200) {
          setTotalOpenedTickets(response.data.totalOpenedTickets)
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

  return {totalOpenedTickets, loading, error}
}