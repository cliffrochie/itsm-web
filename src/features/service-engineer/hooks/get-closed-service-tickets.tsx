import api from '@/hooks/use-api'
import { useState, useEffect } from 'react'
import { IServiceTicket } from '@/@types/service-ticket'
import { handleAxiosError } from '@/utils/error-handler' 




interface ThisResponse {
  closedTickets?: IServiceTicket[]
  loading: boolean
  error?: object | string | undefined 
}


export default function getClosedServiceTickets(): ThisResponse {
  const [closedTickets, setClosedTickets] = useState<IServiceTicket[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = '/api/service-tickets/assigned-closed'

  useEffect(() => {
    async function get() {
      try {
        setLoading(true)
        const response = await api.get(url)
        if(response.status === 200) {
          setClosedTickets(response.data)
        }
      }
      catch(error) {
        setError(handleAxiosError(error))
      }
      finally {
        setLoading(false)
      }
    }

    get()
  }, [])

  return { closedTickets, loading, error }
}