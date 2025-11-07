"use client"

import { useEffect, useState } from "react"
import { UserList } from "@/components/user-management/user-list"
import { UserForm } from "@/components/user-management/user-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function UsuariosPage() {
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
          if (data.user.role !== "super_admin") {
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

  const handleUserCreated = () => {
    setRefreshKey((prev) => prev + 1)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p className="text-gray-600 mt-2">Crie e gerencie operadores do sistema</p>
      </div>

      {showForm && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle>Criar Novo Operador</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSuccess={handleUserCreated} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          + Novo Operador
        </button>
      )}

      <UserList key={refreshKey} />
    </div>
  )
}
