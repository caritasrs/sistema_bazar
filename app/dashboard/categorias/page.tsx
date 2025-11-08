"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CategoriesManagement } from "@/components/categories/categories-management"

export default function CategoriasPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/verify-session")
        const data = await response.json()

        if (!data.authenticated) {
          router.push("/login")
          return
        }

        if (data.user.role !== "admin" && data.user.role !== "super_admin") {
          router.push("/dashboard")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-950">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestão de Categorias</h1>
              <p className="text-red-100">Configure categorias e produtos do bazar</p>
            </div>
            <div className="text-right">
              <p className="text-red-100 text-sm">Sistema Caritas RS</p>
              <p className="text-white font-semibold capitalize">{user.role}</p>
            </div>
          </div>

          <CategoriesManagement />
        </div>
      </div>
    </div>
  )
}
