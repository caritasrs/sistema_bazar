"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BatchManagement from "@/components/batches/batch-management"

export default function LotesPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session")
        const data = await response.json()

        if (data.authenticated) {
          if (!["super_admin", "admin", "operator"].includes(data.user.role)) {
            router.push("/dashboard")
          }
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      }
    }

    verifySession()
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lotes de Doação</h1>
          <p className="text-red-100">Gerencie lotes de mercadorias recebidas</p>
        </div>

        <div className="bg-red-900/25 backdrop-blur-md rounded-xl border border-red-300/20 p-6 shadow-xl">
          <BatchManagement />
        </div>
      </div>
    </div>
  )
}
