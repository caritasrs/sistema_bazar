"use client"

import { useEffect, useState } from "react"
import { ClientList } from "@/components/client-management/client-list"
import { ClientForm } from "@/components/client-management/client-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ClientesPage() {
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session")
        const data = await response.json()

        if (data.authenticated) {
          if (data.user.role !== "super_admin" && data.user.role !== "admin" && data.user.role !== "operator") {
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

  const handleClientCreated = () => {
    setRefreshKey((prev) => prev + 1)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
        <p className="text-white/90 mt-2">Crie e gerencie clientes do sistema</p>
      </div>

      {showForm && (
        <Card className="border-red-200/30 bg-red-900/25 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Criar Novo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientForm onSuccess={handleClientCreated} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          + Novo Cliente
        </button>
      )}

      <ClientList key={refreshKey} />
    </div>
  )
}
