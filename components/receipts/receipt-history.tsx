"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

export function ReceiptHistory() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      const response = await fetch("/api/receipts/list")
      const data = await response.json()
      setReceipts(data || [])
    } catch (error) {
      console.error("[v0] Error fetching receipts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando histórico...</div>
  }

  return (
    <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
      <CardHeader>
        <CardTitle className="text-white">Histórico de Recibos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {receipts.length === 0 ? (
            <p className="text-white/70 text-center py-8">Nenhum recibo encontrado</p>
          ) : (
            receipts.map((receipt: any) => (
              <div
                key={receipt.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-white">#{receipt.receipt_number}</div>
                  <div className="text-sm text-white/80">
                    {new Date(receipt.created_at).toLocaleDateString("pt-BR")} - R$ {receipt.total_amount}
                  </div>
                  <div className="text-xs text-white/60">{receipt.customer?.name || "Cliente não informado"}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
