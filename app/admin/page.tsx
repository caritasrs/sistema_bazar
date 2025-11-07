"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/analytics/stat-card"
import { formatCurrency } from "@/lib/format-utils"
import { ShoppingCart, Users, Calendar, FileText, BarChart3, Gift } from "lucide-react"

export default function AdminPage() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]
        const response = await fetch(`/api/analytics/summary?start_date=${today}&end_date=${today}`)
        if (response.ok) {
          setSummary(await response.json())
        }
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  const modules = [
    {
      icon: Gift,
      title: "Gestão de Doações",
      description: "Entrada de mercadorias e rastreabilidade",
      href: "/admin/donations",
      color: "bg-red-700/40 text-white",
    },
    {
      icon: ShoppingCart,
      title: "Ponto de Venda",
      description: "Vendas simbólicas e checkout",
      href: "/admin/sales",
      color: "bg-red-700/40 text-white",
    },
    {
      icon: FileText,
      title: "Recibos",
      description: "Gestão de recibos personalizados",
      href: "/admin/receipts",
      color: "bg-red-700/40 text-white",
    },
    {
      icon: Users,
      title: "CRM Solidário",
      description: "Gestão de clientes e relacionamento",
      href: "/admin/crm",
      color: "bg-red-700/40 text-white",
    },
    {
      icon: Calendar,
      title: "Agenda",
      description: "Agendamentos e controle de fluxo",
      href: "/admin/scheduling",
      color: "bg-red-700/40 text-white",
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description: "Analytics e métricas do bazar",
      href: "/admin/analytics",
      color: "bg-red-700/40 text-white",
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="bg-red-900/30 backdrop-blur-md text-white p-6 shadow-lg border-b border-red-300/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Sistema de Gestão Solidária</h1>
          <p className="text-red-100">Cáritas RS 3.5 - Bazar Solidário</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        {summary && !loading && (
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              title="Vendas Hoje"
              value={formatCurrency(summary.totalSales)}
              subtitle={`${summary.totalTransactions} transações`}
            />
            <StatCard
              title="Doações"
              value={summary.totalDonations}
              subtitle={`Valor: ${formatCurrency(summary.totalDonationValue)}`}
            />
            <StatCard title="Clientes Ativos" value={summary.activeCustomers} />
            <StatCard title="Agendamentos" value={summary.upcomingSchedules} subtitle="Confirmados hoje" />
          </div>
        )}

        {/* Quick Links */}
        <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
          <CardHeader>
            <CardTitle className="text-white">Módulos do Sistema</CardTitle>
            <CardDescription className="text-red-50">
              Acesse os diferentes módulos de gestão do Bazar Solidário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <Link key={module.href} href={module.href} className="block">
                    <Card className="h-full hover:shadow-2xl transition-all cursor-pointer bg-red-900/20 backdrop-blur-md border-red-300/30 hover:bg-red-900/30">
                      <CardHeader>
                        <div
                          className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-2 backdrop-blur-sm`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-lg text-white">{module.title}</CardTitle>
                        <CardDescription className="text-red-50">{module.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
          <CardHeader>
            <CardTitle className="text-white">Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-red-50">
            <p>
              <strong className="text-white">Versão:</strong> 3.5 - Sistema de Gestão Solidária Cáritas RS
            </p>
            <p>
              <strong className="text-white">Objetivos:</strong> Controle de doações, gestão de vendas simbólicas,
              emissão de recibos, agendamentos públicos e análises gerenciais.
            </p>
            <p>
              <strong className="text-white">Conformidade:</strong> LGPD, NIST SP 800-63B, Rastreabilidade Total
            </p>
            <p>
              <strong className="text-white">Contato:</strong> rs@caritas.org.br | (51) 3222-7000
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
