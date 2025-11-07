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
  const [userTypeToCreate, setUserTypeToCreate] = useState<"admin" | "operator">("operator")
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify-session")
        const data = await response.json()

        if (data.authenticated) {
          if (data.user.role !== "super_admin" && data.user.role !== "admin") {
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
        <p className="text-gray-600 mt-2">
          {user?.role === "super_admin"
            ? "Crie e gerencie administradores e operadores do sistema"
            : "Crie e gerencie operadores do sistema"}
        </p>
      </div>

      {showForm && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle>Criar Novo {userTypeToCreate === "admin" ? "Administrador" : "Operador"}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              roleToCreate={userTypeToCreate}
              onSuccess={handleUserCreated}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <div className="flex gap-3">
          {user?.role === "super_admin" && (
            <>
              <button
                onClick={() => {
                  setUserTypeToCreate("admin")
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                + Novo Administrador
              </button>
              <button
                onClick={() => {
                  setUserTypeToCreate("operator")
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                + Novo Operador
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() => {
                setUserTypeToCreate("operator")
                setShowForm(true)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              + Novo Operador
            </button>
          )}
        </div>
      )}

      <UserList key={refreshKey} />
    </div>
  )
}
