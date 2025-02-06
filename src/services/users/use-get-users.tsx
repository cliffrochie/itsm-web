import api from '@/services/use-api'
import { IUser } from '@/@types/user'
import { useState, useEffect } from 'react'


interface ThisResponse {
  users: IUser[] | []
  page?: number
  totalPages?: number
  total?: number
  loading: boolean
  error?: object | string | undefined 
}

export default function useGetUsers(url: string): ThisResponse {
  const [users, setUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true)
        const response = await api.get(url)
        setUsers(response.data.results)
        setPage(response.data.page)
        setTotalPages(response.data.totalPages)
        setTotal(response.data.total)
      }
      catch(error: any) {
        console.log(error)
        const err = {
          code: error?.response?.data.errorResponse.code,
          message: error?.response?.data.errorResponse.errmsg,
          keyPattern: error?.response?.data.errorResponse.keyPattern,
          keyValue: error?.response?.data.errorResponse.keyValue
        }
        setError(err || "An unknown error occurred." || undefined)
      }
      finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [url])

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    total
  }
}


export async function getUsers(url: string) {
  const [users, setUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<object | string | undefined>(undefined)

  try {
    const response = await api.get(url)
    setLoading(true)
    setUsers(response.data.results)
    setPage(response.data.page)
    setTotalPages(response.data.totalPages)
    setTotal(response.data.total)
  }
  catch(error: any) {
    console.log(error)
    const err = {
      code: error?.response?.data.errorResponse.code,
      message: error?.response?.data.errorResponse.errmsg,
      keyPattern: error?.response?.data.errorResponse.keyPattern,
      keyValue: error?.response?.data.errorResponse.keyValue
    }
    setError(err || "An unknown error occurred." || undefined)
  }
  finally {
    setLoading(false)
  }

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    total
  }
}