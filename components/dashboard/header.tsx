"use client"

import { useState } from "react"
import { Key } from "lucide-react"
import { ChangePasswordModal } from "@/components/change-password-modal"

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <>
      <header className="bg-red-900/20 backdrop-blur-md border-b border-red-300/20 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-300/20 text-white transition-colors"
              title="Alterar Senha"
            >
              <Key className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Alterar Senha</span>
            </button>
            <div className="text-right bg-red-900/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-300/20">
              <p className="text-sm font-medium text-white">Sistema Caritas RS</p>
              <p className="text-xs text-red-100">
                {user?.role === "super_admin" && "Super Admin"}
                {user?.role === "admin" && "Admin"}
                {user?.role === "operator" && "Operador"}
                {user?.role === "client" && "Cliente"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userEmail={user?.email || ""}
      />
    </>
  )
}
