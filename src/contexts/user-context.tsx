import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import api from '@/services/use-api'
import axios from 'axios'


interface IUser {
  _id: string
  username: string
  email: string
}

interface IUserContextValue {
  user?: IUser | null
  setToken(value: string): void
  logout(): void
}

const UserContext = createContext<IUserContextValue>({
  user: null,
  setToken(value: string) {},
  logout() {}
})

function UserProvider({ children }: any) {
  const [user, setUser] = useState<IUser | null >(null)
  const [token, setToken] = useState<string | null>(null)
  const nav = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    nav('/login')
  }

  useEffect(() => {
    axios.get('/api/users/current-user', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token')
        nav('/login')
      })
  }, [token])

  return <UserContext.Provider value = {{ user, setToken, logout }}>
    {children}
  </UserContext.Provider>
}

export default UserProvider
export const useUser = () => useContext(UserContext)



