"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/format-utils"

interface ReceiptItem {
  description: string
  quantity: number
  unit_price: number
}

interface ReceiptTemplateProps {
  receipt: {
    receipt_number: string
    created_at: string
    operator_name: string
    payment_method: string
    customer?: {
      name: string
      cpf: string
      phone?: string
      email?: string
    }
    items: ReceiptItem[]
    total_amount: number
  }
  onPrint?: () => void
}

export function ReceiptTemplate({ receipt, onPrint }: ReceiptTemplateProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=500,height=700")
      if (printWindow) {
        printWindow.document.write(receiptRef.current.outerHTML)
        printWindow.document.close()
        printWindow.print()
        onPrint?.()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={receiptRef}
        className="w-80 bg-white p-0 text-xs font-mono print:p-0 mx-auto"
        style={{ fontFamily: "Courier New, monospace", fontSize: "10px", lineHeight: "1.2" }}
      >
        {/* Header with Caritas Logo */}
        <div className="text-center border-b border-black py-2">
          <div className="font-bold text-sm mb-1">♱ CÁRITAS BRASILEIRA ♱</div>
          <div className="font-bold">REGIONAL RS</div>
          <div className="text-xs mt-1">Bazar Solidário</div>
        </div>

        {/* Institution Info */}
        <div className="text-center border-b border-black py-2 text-xs">
          <div>R. Cel. André Belo, 452</div>
          <div>Porto Alegre – RS</div>
          <div className="mt-1">CNPJ: 12.345.678/0001-99</div>
          <div>rs.caritas.org.br</div>
        </div>

        {/* Receipt Header */}
        <div className="text-center border-b border-black py-2">
          <div className="font-bold">RECIBO SIMBÓLICO</div>
          <div>Nº {receipt.receipt_number}</div>
        </div>

        {/* Date and Operator */}
        <div className="border-b border-black py-2 px-1">
          <div className="flex justify-between">
            <span>Data:</span>
            <span>{formatDateTime(receipt.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Operador:</span>
            <span>{receipt.operator_name}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-b border-black py-2 px-1">
          <div className="font-bold mb-1">CLIENTE:</div>
          <div>{receipt.customer?.name || "Não identificado"}</div>
          <div>CPF: {receipt.customer?.cpf || "---"}</div>
          {receipt.customer?.phone && <div>Tel: {receipt.customer.phone}</div>}
          {receipt.customer?.email && <div>Email: {receipt.customer.email}</div>}
        </div>

        {/* Items */}
        <div className="border-b border-black py-2 px-1">
          {receipt.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-1">
              <span>
                {item.quantity}x {item.description}
              </span>
              <span>R$ {(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-b border-black py-2 px-1">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL SIMBÓLICO:</span>
            <span>{formatCurrency(receipt.total_amount)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border-b border-black py-2 px-1">
          <div className="flex justify-between">
            <span>FORMA DE PAGAMENTO:</span>
            <span className="font-bold">{receipt.payment_method === "pix" ? "PIX" : "DINHEIRO"}</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS:</span>
            <span className="font-bold">PAGO</span>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center border-b border-black py-3 px-1">
          <div className="text-xs font-bold">A Cáritas RS agradece sua</div>
          <div className="text-xs font-bold">contribuição solidária.</div>
          <div className="mt-2 text-xs italic">Cada gesto transforma vidas.</div>
        </div>

        {/* CNPJ Info Footer */}
        <div className="text-center py-2 px-1">
          <div className="text-xs">CNPJ EMISSOR:</div>
          <div className="text-xs font-bold">12.345.678/0001-99</div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={handlePrint} className="bg-red-600 hover:bg-red-700">
          Imprimir Recibo
        </Button>
      </div>
    </div>
  )
}
