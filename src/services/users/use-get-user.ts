import api from '@/services/use-api'
import { IUser } from '@/@types/user'
import { useState, useEffect } from 'react'


interface ThisResponse {
  user: IUser | null
  loading: boolean
  error?: object | string | undefined 
}

export default function useGetUser(url: string): ThisResponse {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        const response = await api.get(url)
        setUser(response.data)
      }
      catch(error: any) {
        const err = {
          code: error?.response?.data?.errorResponse?.code,
          message: error?.response?.data?.errorResponse?.errmsg,
          keyPattern: error?.response?.data?.errorResponse?.keyPattern,
          keyValue: error?.response?.data?.errorResponse?.keyValue
        }
        setError(err || "An unknown error occurred." || undefined)
      }
      finally {
        setLoading(false)
      }
    }

    getUser()
  }, [url])

  return { user, loading, error}
}
