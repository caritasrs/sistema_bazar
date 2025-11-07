"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, DollarSign, Package, Users, TrendingUp, Calendar } from "lucide-react"

export function ReportsAnalytics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    itemsInStock: 0,
    activeClients: 0,
    monthlyGrowth: 0,
    scheduledVisits: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/reports/stats")
      const data = await response.json()
      setStats(data.stats || stats)
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  const statCards = [
    {
      title: "Vendas Totais",
      value: stats.totalSales,
      icon: BarChart3,
      color: "bg-blue-600",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-600",
    },
    {
      title: "Itens em Estoque",
      value: stats.itemsInStock,
      icon: Package,
      color: "bg-orange-600",
    },
    {
      title: "Clientes Ativos",
      value: stats.activeClients,
      icon: Users,
      color: "bg-purple-600",
    },
    {
      title: "Crescimento Mensal",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: "bg-teal-600",
    },
    {
      title: "Visitas Agendadas",
      value: stats.scheduledVisits,
      icon: Calendar,
      color: "bg-pink-600",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-red-900/10 backdrop-blur-md border-red-800/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
