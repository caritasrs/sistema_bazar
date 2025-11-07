"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session")
        const data = await response.json()

        if (data.authenticated) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {user?.role === "super_admin" && "Gerencie operadores, clientes e sistema"}
          {user?.role === "operator" && "Gerencie clientes e vendas"}
          {user?.role === "client" && "Acesse seus pedidos e agendamentos"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Seu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded w-fit">
                {user?.role === "super_admin" && "Super Admin"}
                {user?.role === "operator" && "Operador"}
                {user?.role === "client" && "Cliente"}
              </p>
            </div>
          </CardContent>
        </Card>

        {(user?.role === "super_admin" || user?.role === "operator") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user?.role === "super_admin" && (
                  <>
                    <a href="/dashboard/usuarios" className="block text-red-600 hover:underline text-sm">
                      → Gerenciar Operadores
                    </a>
                    <a href="/dashboard/clientes" className="block text-red-600 hover:underline text-sm">
                      → Gerenciar Clientes
                    </a>
                  </>
                )}
                {user?.role === "operator" && (
                  <a href="/dashboard/clientes" className="block text-red-600 hover:underline text-sm">
                    → Gerenciar Clientes
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
