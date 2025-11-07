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
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: ShoppingCart,
      title: "Ponto de Venda",
      description: "Vendas simbólicas e checkout",
      href: "/admin/sales",
      color: "bg-green-50 text-green-700",
    },
    {
      icon: FileText,
      title: "Recibos",
      description: "Gestão de recibos personalizados",
      href: "/admin/receipts",
      color: "bg-purple-50 text-purple-700",
    },
    {
      icon: Users,
      title: "CRM Solidário",
      description: "Gestão de clientes e relacionamento",
      href: "/admin/crm",
      color: "bg-pink-50 text-pink-700",
    },
    {
      icon: Calendar,
      title: "Agenda",
      description: "Agendamentos e controle de fluxo",
      href: "/admin/scheduling",
      color: "bg-orange-50 text-orange-700",
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description: "Analytics e métricas do bazar",
      href: "/admin/analytics",
      color: "bg-red-50 text-red-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <div className="bg-red-600 text-white p-6 shadow-lg">
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
        <Card className="bg-white/95 border-red-200">
          <CardHeader>
            <CardTitle>Módulos do Sistema</CardTitle>
            <CardDescription>Acesse os diferentes módulos de gestão do Bazar Solidário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <Link key={module.href} href={module.href} className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-2`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Versão:</strong> 3.5 - Sistema de Gestão Solidária Cáritas RS
            </p>
            <p>
              <strong>Objetivos:</strong> Controle de doações, gestão de vendas simbólicas, emissão de recibos,
              agendamentos públicos e análises gerenciais.
            </p>
            <p>
              <strong>Conformidade:</strong> LGPD, NIST SP 800-63B, Rastreabilidade Total
            </p>
            <p>
              <strong>Contato:</strong> rs@caritas.org.br | (51) 3222-7000
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
