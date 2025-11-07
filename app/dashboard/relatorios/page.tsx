"use client"

import { ReportsAnalytics } from "@/components/reports/reports-analytics"

export default function RelatoriosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-lg p-6 border border-red-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Relatórios e Analytics</h1>
        <p className="text-white/90">Acompanhe métricas e indicadores do bazar</p>
      </div>

      <ReportsAnalytics />
    </div>
  )
}
