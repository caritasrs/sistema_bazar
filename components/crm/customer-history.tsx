"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateTime } from "@/lib/format-utils"

interface CustomerHistoryProps {
  customerId: string
  customerName: string
}

export function CustomerHistory({ customerId, customerName }: CustomerHistoryProps) {
  const [receipts, setReceipts] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/crm/get-customer-history?id=${customerId}`)
        const data = await response.json()
        setReceipts(data.receipts || [])
        setSchedules(data.schedules || [])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [customerId])

  return (
    <div className="space-y-4">
      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Histórico de {customerName}</CardTitle>
          <CardDescription>Compras e agendamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-600">Compras Realizadas</h3>
                <div className="space-y-2">
                  {receipts.length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhuma compra registrada</div>
                  ) : (
                    receipts.map((receipt) => (
                      <Card key={receipt.id} className="bg-red-50 border-red-100 p-2">
                        <div className="text-sm font-semibold">#{receipt.receipt_number}</div>
                        <div className="text-xs text-gray-600">{formatDateTime(receipt.created_at)}</div>
                        <div className="text-sm font-bold text-red-600">{formatCurrency(receipt.total_amount)}</div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-600">Agendamentos</h3>
                <div className="space-y-2">
                  {schedules.length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhum agendamento registrado</div>
                  ) : (
                    schedules.map((schedule) => (
                      <Card key={schedule.id} className="bg-blue-50 border-blue-100 p-2">
                        <div className="text-sm font-semibold">{schedule.schedule_date}</div>
                        <div className="text-xs text-gray-600">{schedule.schedule_time}</div>
                        <div className="text-xs">Status: {schedule.status}</div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
