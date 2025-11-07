"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Doações",
    value: "1,234",
    icon: Package,
  },
  {
    title: "Beneficiários",
    value: "567",
    icon: Users,
  },
  {
    title: "Este Mês",
    value: "89",
    icon: TrendingUp,
  },
  {
    title: "PIX Recebidos",
    value: "R$ 3.450",
    icon: DollarSign,
  },
]

export function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bazar Solidário - Dashboard</h2>
        <p className="text-muted-foreground mt-2">Bem-vindo ao Sistema de Gestão Solidária Cáritas RS 3.7</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="glass-effect-red border-white/20 backdrop-blur-md hover:scale-105 transition-all"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass-effect-red border-white/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b border-white/20 pb-4 last:border-0">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-white">Doação recebida</p>
                    <p className="text-xs text-white/70">Há {i * 2} horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-red border-white/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-white">Sistema Cáritas RS</p>
              <p className="text-xs text-white/70">v3.7</p>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="font-semibold text-white mb-2">Módulos Ativos</p>
              <ul className="space-y-1 text-xs text-white/80">
                <li>✓ Gestão de Doações</li>
                <li>✓ CRM Solidário</li>
                <li>✓ Emissão de Recibos</li>
                <li>✓ Pagamentos PIX</li>
                <li>✓ Agendamento Online</li>
                <li>✓ Relatórios Analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
