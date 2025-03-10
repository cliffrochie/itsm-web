import api from '@/hooks/use-api'
import { IUser } from '@/@types/user'
import { useState, useEffect } from 'react'


interface ThisResponse {
  authUser: IUser | null
  loading: boolean
  error?: object | string | undefined 
}

export default function useAuthUser(): ThisResponse {
  const [authUser, setAuthUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        const response = await api.get('/api/users/current-user')
        setAuthUser(response.data)
      }
      catch(error: any) {
        console.log(error)
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
  }, [])

  return { authUser, loading, error}
}
