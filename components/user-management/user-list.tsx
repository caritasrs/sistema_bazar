"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        console.log("[v0] Fetching users list...")
        const response = await fetch("/api/users/list")
        const data = await response.json()

        console.log("[v0] Users list response:", data)

        if (response.ok) {
          setUsers(data.users || [])
          console.log("[v0] Users loaded:", data.users?.length || 0)
        } else {
          console.error("[v0] Error response:", data)
          setError(data.error || "Erro ao carregar usuários")
        }
      } catch (error) {
        console.error("[v0] Fetch error:", error)
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

  const admins = users.filter((u) => u.role === "admin")
  const operators = users.filter((u) => u.role === "operator")
  const clients = users.filter((u) => u.role === "client")

  const UserCard = ({ user }: { user: User }) => (
    <div className="flex items-center justify-between p-4 border border-red-200/30 rounded-lg hover:bg-red-900/10 bg-red-900/5 backdrop-blur-sm">
      <div className="flex-1">
        <p className="font-semibold text-white">{user.name}</p>
        <p className="text-sm text-white/80">{user.email}</p>
        <p className="text-xs text-white/60">CPF: {user.cpf}</p>
        {user.phone && <p className="text-xs text-white/60">Tel: {user.phone}</p>}
      </div>
      <div className="text-right">
        <p
          className={`text-xs px-2 py-1 rounded ${user.status === "active" ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}
        >
          {user.status === "active" ? "Ativo" : "Inativo"}
        </p>
      </div>
    </div>
  )

  return (
    <Tabs defaultValue="operators" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-red-900/25 backdrop-blur-md">
        <TabsTrigger value="admins" className="text-white data-[state=active]:bg-red-600">
          Administradores ({admins.length})
        </TabsTrigger>
        <TabsTrigger value="operators" className="text-white data-[state=active]:bg-red-600">
          Operadores ({operators.length})
        </TabsTrigger>
        <TabsTrigger value="clients" className="text-white data-[state=active]:bg-red-600">
          Clientes ({clients.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="admins">
        <Card className="border-red-200/30 bg-red-900/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Administradores do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <p className="text-white/70 text-center py-8">Nenhum administrador cadastrado</p>
            ) : (
              <div className="space-y-3">
                {admins.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="operators">
        <Card className="border-red-200/30 bg-red-900/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Operadores do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {operators.length === 0 ? (
              <p className="text-white/70 text-center py-8">Nenhum operador cadastrado</p>
            ) : (
              <div className="space-y-3">
                {operators.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="clients">
        <Card className="border-red-200/30 bg-red-900/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Clientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-white/70 text-center py-8">Nenhum cliente cadastrado</p>
            ) : (
              <div className="space-y-3">
                {clients.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
