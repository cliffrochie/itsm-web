import api from '@/hooks/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 




interface TotalUserRoles {
  total: number
  totalAdmin: number
  totalStaff: number
  totalUser: number
}

interface ThisResponse {
  totalUserRoles?: TotalUserRoles
  loading: boolean
  error?: object | string | undefined 
}

const queryParams = [
  'totalSuperAdmin',
  'totalAdmin',
  'totalStaff',
  'totalUser',
]


export default function useGetTotalUserRole(): ThisResponse {
  const [totalUserRoles, setTotalUserRoles] = useState<TotalUserRoles | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = '/api/users/total-user-role/?total=true'
  queryParams.forEach(a => url += `&${a}=true`)

  // console.log(url)

  useEffect(() => {
    async function getTotalUserRoles() {
      try {
        setLoading(true)
        
        const response = await api.get(url)
        if(response.status === 200) {
          setTotalUserRoles(response.data)
        }
      }
      catch(error) {
        setError(handleAxiosError(error))
      }
      finally {
        setLoading(false)
      }
    }

    getTotalUserRoles()
  }, [])

  return {totalUserRoles, loading, error}
}