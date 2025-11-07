"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  email: string
  name: string
  cpf: string
  role: string
  status: string
  phone?: string
  created_at: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/list")
        const data = await response.json()

        if (response.ok) {
          setUsers(data.users || [])
        } else {
          setError(data.error || "Erro ao carregar usuários")
        }
      } catch (error) {
        setError("Erro ao conectar ao servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operadores do Sistema ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum operador cadastrado</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">CPF: {user.cpf}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs px-2 py-1 rounded ${user.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {user.status === "active" ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
