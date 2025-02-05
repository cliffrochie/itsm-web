import api from "./use-api"
import Cookies from "js-cookie"




export async function login(username: string, password: string) {
  try {
    const response = await api.post('/api/users/signin', { username, password })
    if(response.status === 200) {
      return true
    }
    return false
  } 
  catch(error: any) {
    throw error.response?.data || 'Login failed'
  }
}


export async function logout() {
  Cookies.remove('token')
}