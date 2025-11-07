"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Doações",
    value: "1,234",
    icon: Package,
    color: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    title: "Beneficiários",
    value: "567",
    icon: Users,
    color: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    title: "Este Mês",
    value: "89",
    icon: TrendingUp,
    color: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    title: "PIX Recebidos",
    value: "R$ 3.450",
    icon: DollarSign,
    color: "bg-red-50",
    textColor: "text-red-700",
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
            <Card key={stat.title} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className={`h-5 w-5 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0">
                  <div className="h-10 w-10 rounded-full bg-red-100" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Doação recebida</p>
                    <p className="text-xs text-muted-foreground">Há {i * 2} horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Sistema Cáritas RS</p>
              <p className="text-xs text-muted-foreground">v3.7</p>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold text-foreground mb-2">Módulos Ativos</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
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
