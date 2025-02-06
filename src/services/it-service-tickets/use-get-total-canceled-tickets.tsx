import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalCanceledTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalCanceledTickets(): ThisResponse {
  const [totalCanceledTickets, setTotalCanceledTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalCanceledTickets=true')
        if(response.status === 200) {
          setTotalCanceledTickets(response.data.totalCanceledTickets)
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

  return {totalCanceledTickets, loading, error}
}