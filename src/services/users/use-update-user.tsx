import api from '@/services/use-api'
import { IUser } from '@/@types/user'
import { useState, useEffect } from 'react'


interface ThisResponse {
  user: IUser | null
  loading: boolean
  error?: object | string | undefined 
}

export default function useUpdateUser(url: string, body: object | null): ThisResponse {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function createUser() {
      try {
        setLoading(true)
        const response = await api.put(url, body)
        setUser(response.data)
      }
      catch(error: any) {
        const err = {
          code: error?.response?.data?.errorResponse?.code,
          message: error?.response?.data?.errorResponse?.errmsg,
          keyPattern: error?.response?.data?.errorResponse?.keyPattern,
          keyValue: error?.response?.data?.errorResponse?.keyValue
        }
        setError(err.code ? error : "An unknown error occurred.")
      }
      finally {
        setLoading(false)
      }
    }

    createUser()
  }, [url])

  return { user, loading, error }
}