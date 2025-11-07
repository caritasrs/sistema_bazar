"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Key } from "lucide-react"
import { ChangePasswordModal } from "@/components/change-password-modal"
import { SelfRegisteredClientsWidget } from "@/components/dashboard/self-registered-clients-widget"
import { ReleaseNotesCard } from "@/components/dashboard/release-notes"

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
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
    <>
      <div className="space-y-6">
        <div className="bg-red-900/25 backdrop-blur-md rounded-2xl p-6 border border-red-300/20">
          <h1 className="text-3xl font-bold text-white">Bem-vindo ao Dashboard</h1>
          <p className="text-red-50 mt-2">
            {user?.role === "super_admin" && "Gerencie administradores, operadores, clientes e sistema"}
            {user?.role === "admin" && "Gerencie operadores, clientes e acesse todos os recursos"}
            {user?.role === "operator" && "Gerencie clientes e vendas"}
            {user?.role === "client" && "Acesse seus pedidos e agendamentos"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-red-50">Seu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-red-50">{user?.email}</p>
                <p className="text-xs bg-red-700/40 text-white px-2 py-1 rounded w-fit backdrop-blur-sm">
                  {user?.role === "super_admin" && "Super Admin"}
                  {user?.role === "admin" && "Administrador"}
                  {user?.role === "operator" && "Operador"}
                  {user?.role === "client" && "Cliente"}
                </p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 bg-red-700/40 hover:bg-red-700/60 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-3 w-full justify-center"
                >
                  <Key className="h-4 w-4" />
                  Alterar Senha
                </button>
              </div>
            </CardContent>
          </Card>

          {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "operator") && (
            <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-50">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user?.role === "super_admin" && (
                    <>
                      <a href="/dashboard/usuarios" className="block text-white hover:text-red-200 text-sm font-medium">
                        → Gerenciar Usuários
                      </a>
                      <a href="/dashboard/clientes" className="block text-white hover:text-red-200 text-sm font-medium">
                        → Gerenciar Clientes
                      </a>
                    </>
                  )}
                  {(user?.role === "admin" || user?.role === "operator") && (
                    <a href="/dashboard/clientes" className="block text-white hover:text-red-200 text-sm font-medium">
                      → Gerenciar Clientes
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {user?.role === "super_admin" && <ReleaseNotesCard />}
        </div>

        {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "operator") && (
          <SelfRegisteredClientsWidget />
        )}
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userEmail={user?.email || ""}
      />
    </>
  )
}
