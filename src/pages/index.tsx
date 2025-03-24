import { FormEvent, useEffect, useState} from 'react'
import { useAuth } from '@/contexts/auth-context'
import api from '@/hooks/use-api'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '@/assets/images/logo.svg'


export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      switch(user.role) {
        case 'user':
          navigate('/client')
          break
        case 'staff':
          navigate('/service-engineer')
          break
        case 'admin':
          navigate('/admin')
          break
      } 
    }
  }, [user])

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-2xl">
          <img src={Logo} width="250" alt="logo" className="" />
          <h2 className="text-6xl font-semibold font-mono text-gray-700 mb-4">
            NIA ITSM
          </h2>
          <p className="text-lg text-gray-600">
            IT Service Management System
          </p>
          <p className="text-lg text-gray-500 mb-8">
            The best place to seek IT assistance in NIA Caraga.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="default" className="bg-gray-600" size="lg" onClick={() => navigate('/sign-up')}>Sign Up</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/sign-in')}>Sign In</Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-100">
        <div className="container mx-auto text-center text-gray-600">
          © 2025 NIA ITSM. All rights reserved.
        </div>
      </footer>
    </div>
  )
}