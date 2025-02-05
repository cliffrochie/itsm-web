import { FormEvent, useState} from 'react'
import { useAuth } from '@/contexts/auth-context'
import api from '@/services/use-api'
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



export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Welcome to NIA IT Service Management System
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The best place to seek IT assistance in our office.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="default" size="lg" onClick={() => navigate('/sign-up')}>Sign Up</Button>
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