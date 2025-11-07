"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CaritasLogo } from "@/components/caritas-logo"

interface SidebarProps {
  user: any
}

export function Sidebar({ user }: SidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="w-64 bg-red-900/25 backdrop-blur-md text-white flex flex-col border-r border-red-300/20 shadow-xl">
      <div className="p-6 border-b border-red-300/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative h-10 w-10 rounded-lg bg-white p-2 shadow-md">
            <CaritasLogo className="h-full w-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Cáritas RS</h2>
          </div>
        </div>
        <p className="text-red-100 text-sm">Gestão Solidária 3.5</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg"
        >
          Dashboard
        </Link>

        {(user?.role === "super_admin" || user?.role === "admin") && (
          <Link
            href="/dashboard/usuarios"
            className="block px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg"
          >
            Gestão de Usuários
          </Link>
        )}

        {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "operator") && (
          <Link
            href="/dashboard/clientes"
            className="block px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg"
          >
            Gestão de Clientes
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-red-300/20">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-800/40 rounded-lg hover:bg-red-800/60 transition-all text-sm font-medium backdrop-blur-sm border border-red-300/20 hover:shadow-lg"
        >
          Desconectar
        </button>
      </div>
    </div>
  )
}
