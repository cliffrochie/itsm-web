import axios from 'axios'
import env from '@/utils/env'
import Cookies from 'js-cookie'


const api = axios.create({ baseURL: env('SERVER_URL') || 'http://localhost:5500' })

api.interceptors.request.use(
  config => {
    const token = Cookies.get('jwt')
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  Promise.reject
)

export default api