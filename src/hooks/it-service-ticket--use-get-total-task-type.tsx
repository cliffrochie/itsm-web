import api from '@/hooks/use-api'
import { useState, useEffect } from 'react'
import { handleAxiosError } from '@/utils/error-handler' 




interface Tickets {
  totalTickets: number
  totalIncident: number
  totalServiceRequest: number
  totalAssetRequest: number
  totalMaintenance: number
  totalConsultation: number
  totalAccessibility: number
}

interface ThisResponse {
  totalTaskTypes?: Tickets
  loading: boolean
  error?: object | string | undefined 
}

const queryParams = [
  'totalTickets',
  'totalIncident',
  'totalServiceRequest',
  'totalAssetRequest',
  'totalMaintenance',
  'totalConsultation',
  'totalAccessibility',
]


export default function useGetTotalTaskType(): ThisResponse {
  const [totalTaskTypes, setTaskTypes] = useState<Tickets | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  let url = '/api/service-tickets/total-task-type/?totalTickets=true'
  queryParams.forEach(a => url += `&${a}=true`)

  // console.log(url)

  useEffect(() => {
    async function getTotalTaskType() {
      try {
        setLoading(true)
        
        const response = await api.get(url)
        if(response.status === 200) {
          setTaskTypes(response.data)
        }
      }
      catch(error) {

        setError(handleAxiosError(error))
      }
      finally {
        setLoading(false)
      }
    }

    getTotalTaskType()
  }, [])

  return {totalTaskTypes, loading, error}
}