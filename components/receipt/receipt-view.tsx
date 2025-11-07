"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptTemplate } from "./receipt-template"
import { formatCurrency, formatDateTime } from "@/lib/format-utils"

interface ReceiptViewProps {
  receiptNumber?: string
  receiptId?: string
}

export function ReceiptView({ receiptNumber, receiptId }: ReceiptViewProps) {
  const [receipt, setReceipt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const params = new URLSearchParams()
        if (receiptNumber) params.append("number", receiptNumber)
        if (receiptId) params.append("id", receiptId)

        const response = await fetch(`/api/receipts/get?${params.toString()}`)
        if (!response.ok) throw new Error("Recibo não encontrado")

        const data = await response.json()
        setReceipt(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar recibo")
      } finally {
        setLoading(false)
      }
    }

    if (receiptNumber || receiptId) {
      fetchReceipt()
    }
  }, [receiptNumber, receiptId])

  if (loading) {
    return <div className="text-center py-8">Carregando recibo...</div>
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-800">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!receipt) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Detalhes do Recibo</CardTitle>
          <CardDescription>Recibo #{receipt.receipt_number}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Data:</span>
              <div className="font-semibold">{formatDateTime(receipt.created_at)}</div>
            </div>
            <div>
              <span className="text-gray-600">Operador:</span>
              <div className="font-semibold">{receipt.operator_name}</div>
            </div>
            <div>
              <span className="text-gray-600">Cliente:</span>
              <div className="font-semibold">{receipt.customer?.name || "N/A"}</div>
            </div>
            <div>
              <span className="text-gray-600">CPF:</span>
              <div className="font-semibold">{receipt.customer?.cpf || "N/A"}</div>
            </div>
          </div>

          <div className="border-t border-red-200 pt-4">
            <div className="font-semibold mb-2">Itens:</div>
            <div className="space-y-1">
              {receipt.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.description}
                  </span>
                  <span>{formatCurrency(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-red-200 pt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-red-600">{formatCurrency(receipt.total_amount)}</span>
          </div>
        </CardContent>
      </Card>

      <ReceiptTemplate receipt={receipt} />
    </div>
  )
}
