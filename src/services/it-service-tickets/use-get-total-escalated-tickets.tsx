import api from '@/services/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 

interface ThisResponse {
  totalEscalatedTickets: number
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetTotalEscalatedTickets(): ThisResponse {
  const [totalEscalatedTickets, setTotalEscalatedTickets] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getTotalTickets() {
      try {
        setLoading(true)
        const response = await api.get('/api/service-tickets/total/?totalEscalatedTickets=true')
        if(response.status === 200) {
          setTotalEscalatedTickets(response.data.totalEscalatedTickets)
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

  return {totalEscalatedTickets, loading, error}
}