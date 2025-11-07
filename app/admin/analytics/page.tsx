"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/analytics/stat-card"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null)
  const [salesByMethod, setSalesByMethod] = useState<any>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [startDate, endDate])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [summaryRes, methodRes, productsRes] = await Promise.all([
        fetch(`/api/analytics/summary?start_date=${startDate}&end_date=${endDate}`),
        fetch(`/api/analytics/sales-by-method?start_date=${startDate}&end_date=${endDate}`),
        fetch(`/api/analytics/top-products?start_date=${startDate}&end_date=${endDate}&limit=10`),
      ])

      if (summaryRes.ok) setSummary(await summaryRes.json())
      if (methodRes.ok) setSalesByMethod(await methodRes.json())
      if (productsRes.ok) setTopProducts(await productsRes.json())
    } finally {
      setLoading(false)
    }
  }

  const chartData = salesByMethod
    ? [
        { name: "PIX", value: salesByMethod.pix || 0, fill: "#dc2626" },
        { name: "Dinheiro", value: salesByMethod.cash || 0, fill: "#0ea5e9" },
      ]
    : []

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Relatórios e Analytics</h1>
        <p className="text-gray-600">Análise de dados e métricas do Bazar Solidário</p>
      </div>

      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Período</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <Label>Data Inicial</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={loading} />
          </div>
          <div>
            <Label>Data Final</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={loading} />
          </div>
          <div className="flex items-end">
            <Button onClick={loadAnalytics} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? "Carregando..." : "Atualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            title="Vendas Totais"
            value={formatCurrency(summary.totalSales)}
            subtitle={`${summary.totalTransactions} transações`}
          />
          <StatCard
            title="Doações Recebidas"
            value={summary.totalDonations}
            subtitle={`Valor: ${formatCurrency(summary.totalDonationValue)}`}
          />
          <StatCard
            title="Clientes Ativos"
            value={summary.activeCustomers}
            subtitle={`Agendamentos: ${summary.upcomingSchedules}`}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {chartData.length > 0 && (
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Vendas por Método de Pagamento</CardTitle>
              <CardDescription>
                Período: {formatDate(startDate)} a {formatDate(endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {topProducts.length > 0 && (
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
              <CardDescription>Por receita</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="description" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="revenue" fill="#dc2626" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {topProducts.length > 0 && (
        <Card className="bg-white/80 border-red-200">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos - Detalhes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-50 border-b border-red-200">
                  <tr>
                    <th className="text-left p-2">Produto</th>
                    <th className="text-right p-2">Quantidade</th>
                    <th className="text-right p-2">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-red-50">
                      <td className="p-2">{product.description}</td>
                      <td className="text-right p-2 font-semibold">{product.quantity}</td>
                      <td className="text-right p-2 font-semibold text-red-600">{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
