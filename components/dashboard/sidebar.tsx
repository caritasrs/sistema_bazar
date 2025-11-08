"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CaritasLogo } from "@/components/caritas-logo"
import { ChevronDown, ChevronRight, ShoppingCart, Package, Users, Calendar, FileText, Settings } from "lucide-react"

interface SidebarProps {
  user: any
}

export function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const [salesOpen, setSalesOpen] = useState(true)
  const [inventoryOpen, setInventoryOpen] = useState(true)

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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
        >
          <FileText className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "operator") && (
          <div className="space-y-1">
            <button
              onClick={() => setSalesOpen(!salesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 text-white font-medium"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <span>Vendas</span>
              </div>
              {salesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {salesOpen && (
              <div className="ml-4 space-y-1 border-l-2 border-red-300/20 pl-2">
                <Link
                  href="/dashboard/bazar"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Realizar Venda
                </Link>
                <Link
                  href="/dashboard/recibos"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Recibos
                </Link>
                <Link
                  href="/dashboard/clientes"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Clientes
                </Link>
              </div>
            )}
          </div>
        )}

        {(user?.role === "super_admin" || user?.role === "admin" || user?.role === "operator") && (
          <div className="space-y-1">
            <button
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 text-white font-medium"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <span>Gestão de Mercadorias</span>
              </div>
              {inventoryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {inventoryOpen && (
              <div className="ml-4 space-y-1 border-l-2 border-red-300/20 pl-2">
                <Link
                  href="/dashboard/entrada-mercadorias"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Entrada de Mercadorias
                </Link>
                <Link
                  href="/dashboard/estoque"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Estoque
                </Link>
                <Link
                  href="/dashboard/categorias"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Categorias
                </Link>
                <Link
                  href="/dashboard/lotes"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Lotes de Doação
                </Link>
                <Link
                  href="/dashboard/doadores"
                  className="block px-4 py-2 rounded-lg hover:bg-red-800/30 transition-all text-sm text-red-100 hover:text-white"
                >
                  Doadores
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Agendamentos */}
        <Link
          href="/dashboard/agendamentos"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
        >
          <Calendar className="h-5 w-5" />
          <span>Agendamentos</span>
        </Link>

        {/* Gestão de Usuários */}
        {(user?.role === "super_admin" || user?.role === "admin") && (
          <Link
            href="/dashboard/usuarios"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
          >
            <Users className="h-5 w-5" />
            <span>Usuários</span>
          </Link>
        )}

        {/* Marketing */}
        {(user?.role === "super_admin" || user?.role === "admin") && (
          <Link
            href="/dashboard/marketing"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
          >
            <FileText className="h-5 w-5" />
            <span>Marketing</span>
          </Link>
        )}

        {/* Relatórios */}
        {(user?.role === "super_admin" || user?.role === "admin") && (
          <Link
            href="/dashboard/relatorios"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
          >
            <FileText className="h-5 w-5" />
            <span>Relatórios</span>
          </Link>
        )}

        {/* Equipamentos */}
        {(user?.role === "super_admin" || user?.role === "admin") && (
          <Link
            href="/dashboard/equipamentos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/30 transition-all backdrop-blur-sm border border-transparent hover:border-red-300/20 hover:shadow-lg text-white"
          >
            <Settings className="h-5 w-5" />
            <span>Equipamentos</span>
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
