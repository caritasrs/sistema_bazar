"use client"

import { AdminScheduleView } from "@/components/scheduling/admin-schedule-view"

export default function AgendamentosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-lg p-6 border border-blue-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Agenda de Visitas</h1>
        <p className="text-white/90">Visualização completa com dados dos clientes agendados</p>
      </div>

      <AdminScheduleView />
    </div>
  )
}
