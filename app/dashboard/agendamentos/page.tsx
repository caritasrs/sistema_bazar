"use client"

import { AdminScheduleView } from "@/components/scheduling/admin-schedule-view"
import Link from "next/link"
import { ExternalLink, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AgendamentosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
        <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">Agendamentos</span>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-lg p-6 border border-blue-800/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agenda de Visitas</h1>
            <p className="text-white/90">Visualização completa com dados dos clientes agendados</p>
          </div>
          <Link href="/agendar" target="_blank">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Agenda Pública
            </Button>
          </Link>
        </div>
      </div>

      <AdminScheduleView />
    </div>
  )
}
