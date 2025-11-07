"use client"

import { PublicScheduler } from "@/components/scheduling/public-scheduler"

export default function AgendamentosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-lg p-6 border border-red-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Agenda de Visitas</h1>
        <p className="text-white/90">Gerencie agendamentos de visitas ao bazar</p>
      </div>

      <PublicScheduler />
    </div>
  )
}
