import api from '@/hooks/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 
import { IClient } from '@/@types/client'




interface ThisResponse {
  client?: IClient[]
  loading: boolean
  error?: object | string | undefined 
}


export default function useGetClientByName(fullName: string): ThisResponse {
  const [client, setClient] = useState<IClient[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = `/api/clients/?noPage=true&fullName=${fullName}`

  useEffect(() => {
    async function get() {
      try {
        setLoading(true)
        const response = await api.get(url)
        if(response.status === 200 && response.data.length > 0) {
          setClient(response.data)
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

  return { client, loading, error }
}