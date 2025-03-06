import api from '@/hooks/use-api'
import { INotification } from '@/@types/notification'
import { useState, useEffect } from 'react'


interface ThisResponse {
  notifications: INotification | null
  loading: boolean
  error?: object | string | undefined 
}

export default function useGetNotifications(userId: string): ThisResponse {
  const [notifications, setNotifications] = useState<INotification | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function get() {
      try {
        setLoading(true)
        const response = await api.get(`/api/notifications?userId=${userId}&noPage=true`)
        setNotifications(response.data)
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

    get()
  }, [])

  return { notifications, loading, error}
}
