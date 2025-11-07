"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

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
    <div className="w-64 bg-red-600 text-white flex flex-col">
      <div className="p-6 border-b border-red-700">
        <h2 className="text-2xl font-bold">Cáritas RS</h2>
        <p className="text-red-100 text-sm">Gestão Solidária 3.5</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-red-700 transition-colors">
          Dashboard
        </Link>

        {user?.role === "super_admin" && (
          <>
            <Link href="/dashboard/usuarios" className="block px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Gestão de Usuários
            </Link>
            <Link href="/dashboard/clientes" className="block px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Gestão de Clientes
            </Link>
          </>
        )}

        {user?.role === "operator" && (
          <Link href="/dashboard/clientes" className="block px-4 py-2 rounded hover:bg-red-700 transition-colors">
            Gestão de Clientes
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-red-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-700 rounded hover:bg-red-800 transition-colors text-sm font-medium"
        >
          Desconectar
        </button>
      </div>
    </div>
  )
}
