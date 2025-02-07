import api from '@/hooks/use-api'
import { IOffice } from '@/@types/office'
import { useState, useEffect } from 'react'


interface ThisResponse {
  data: IOffice | null
  loading: boolean
  error?: object | string | undefined 
}

export default function useGetOffice(url: string): ThisResponse {
  const [data, setData] = useState<IOffice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getOffice() {
      try {
        setLoading(true)
        const response = await api.get(url)
        setData(response.data)
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

    getOffice()
  }, [url])

  return { data, loading, error}
}
