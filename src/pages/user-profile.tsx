import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function ProfilePage() {


  return (
    <section className="grid gap-4">
      <div className="text-xl font-semibold">User Profile</div>
      <div>
        <div id="buttons" className="">

        </div>
      </div>
    </section>
  )
}