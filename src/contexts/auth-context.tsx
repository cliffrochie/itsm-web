import { createContext, useState, useEffect, ReactNode, useContext, Suspense } from "react";
import Cookies from "js-cookie";
import { IUser } from "@/@types/user";
import { login, logout } from "@/services/use-auth";  // Ensure correct path
import api from "@/services/use-api";


interface AuthContextType {
  user: IUser | null
  loading: boolean
  error: string | null
  handleLogin: (email: string, password: string) => Promise<any>
  handleLogout: () => void
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true)
  //       const response = await api.get('/api/users/current-user')
  //       if(response.status === 200) {
  //         setUser(response.data);
  //       }
  //     }
  //     catch(error: any) {
  //       setError(error.message || 'Failed to fetch current user')
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, []);

  useEffect(() => {
    setLoading(true)
    api.get('/api/users/current-user') 
      .then(response => {
        if(response.status === 200) {
          setUser(response.data)
          setLoading(false)
        }
        else {
          setLoading(false)
        }
      })
      .catch(error => {
        // console.error(error)
        setLoading(false)
        setError(error)
      })
  }, [])

  const handleLogin = async (email: string, password: string): Promise<any> => {
    const result = await login(email, password);
    if(result) {
      const response = await api.get('/api/users/current-user')
      setLoading(true)
      if(response.status === 200) {
        setUser(response.data);
        setLoading(false)
      }
      else {
        setLoading(false)
      }
      return response
    }
    return undefined
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if(loading) {
    return <div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>;  // Fallback UI during hydration
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
  
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};