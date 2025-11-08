"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, CheckCircle, ArrowLeft, Clock } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface Receipt {
  id: string
  receipt_number: string
  created_at: string
  operator_name: string
  payment_method: string
  total_amount: number
  status: string
  pix_url: string | null
  customer: {
    name: string
    cpf: string
    phone?: string
    email?: string
  }
  items: Array<{
    description: string
    quantity: number
    unit_price: number
  }>
}

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [pixSettings, setPixSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadReceipt()
    loadPixSettings()
  }, [params.id])

  const loadReceipt = async () => {
    try {
      const response = await fetch(`/api/receipts/get?id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setReceipt(data.receipt)
      } else {
        alert("Recibo não encontrado")
      }
    } catch (error) {
      console.error("[v0] Error loading receipt:", error)
      alert("Erro ao carregar recibo")
    } finally {
      setLoading(false)
    }
  }

  const loadPixSettings = async () => {
    try {
      const response = await fetch("/api/settings/get")
      if (response.ok) {
        const data = await response.json()
        setPixSettings(data.settings)
      }
    } catch (error) {
      console.error("[v0] Error loading PIX settings:", error)
    }
  }

  const handleConfirmPayment = async () => {
    if (!receipt) return

    const confirmed = confirm("Confirmar que o pagamento PIX foi recebido?")
    if (!confirmed) return

    setConfirming(true)
    try {
      const response = await fetch("/api/receipts/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_id: receipt.id }),
      })

      if (response.ok) {
        alert("Pagamento confirmado com sucesso!")
        loadReceipt() // Reload to update status
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao confirmar pagamento")
      }
    } catch (error) {
      console.error("[v0] Error confirming payment:", error)
      alert("Erro ao confirmar pagamento")
    } finally {
      setConfirming(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center">
        <Card className="p-8 bg-white/10 backdrop-blur-md border-red-300/20">
          <p className="text-white text-center">Carregando recibo...</p>
        </Card>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center">
        <Card className="p-8 bg-white/10 backdrop-blur-md border-red-300/20">
          <p className="text-white text-center mb-4">Recibo não encontrado</p>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  const isPix = receipt.payment_method === "pix"
  const isPending = receipt.status === "pending"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header - Hide on print */}
        <div className="flex items-center gap-4 print:hidden">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/bazar")}
            className="border-red-300/30 text-white hover:bg-red-900/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Vendas
          </Button>
          <h1 className="text-2xl font-bold text-white">Recibo de Venda</h1>
        </div>

        {/* Status Alert */}
        {isPix && isPending && (
          <Card className="p-6 bg-yellow-500/20 backdrop-blur-md border-yellow-300/30 print:hidden">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Aguardando Pagamento PIX</h3>
                <p className="text-white/90 mb-4">
                  O pagamento ainda não foi confirmado. Peça ao cliente para escanear o QR Code abaixo e realizar o
                  pagamento. Após receber a confirmação, clique no botão "Confirmar Pagamento".
                </p>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {confirming ? "Confirmando..." : "Confirmar Pagamento Recebido"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipt */}
          <Card className="p-8 bg-white print:shadow-none">
            {/* Receipt Content */}
            <div className="space-y-4 text-sm">
              {/* Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4">
                <div className="text-lg font-bold">♱ CÁRITAS BRASILEIRA ♱</div>
                <div className="font-bold">REGIONAL RS</div>
                <div className="text-xs mt-1">Bazar Solidário</div>
                <div className="text-xs mt-2">R. Cel. André Belo, 452</div>
                <div className="text-xs">Porto Alegre – RS</div>
              </div>

              {/* Receipt Info */}
              <div className="border-b border-gray-300 pb-3">
                <div className="text-center font-bold">RECIBO SIMBÓLICO</div>
                <div className="text-center">Nº {receipt.receipt_number}</div>
                <div className="mt-2 text-xs">Data: {new Date(receipt.created_at).toLocaleString("pt-BR")}</div>
                <div className="text-xs">Operador: {receipt.operator_name}</div>
              </div>

              {/* Customer */}
              <div className="border-b border-gray-300 pb-3">
                <div className="font-bold mb-1">CLIENTE:</div>
                <div>{receipt.customer.name}</div>
                <div className="text-xs">CPF: {receipt.customer.cpf}</div>
                {receipt.customer.phone && <div className="text-xs">Tel: {receipt.customer.phone}</div>}
              </div>

              {/* Items */}
              <div className="border-b border-gray-300 pb-3">
                <div className="font-bold mb-2">ITENS:</div>
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
              <div className="border-b border-gray-300 pb-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>R$ {receipt.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="border-b border-gray-300 pb-3">
                <div className="flex justify-between">
                  <span>PAGAMENTO:</span>
                  <span className="font-bold">{isPix ? "PIX" : "DINHEIRO"}</span>
                </div>
                <div className="flex justify-between">
                  <span>STATUS:</span>
                  <span className={`font-bold ${isPending ? "text-yellow-600" : "text-green-600"}`}>
                    {isPending ? "PENDENTE" : "PAGO"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs pt-3">
                <div className="font-bold">A Cáritas RS agradece sua</div>
                <div className="font-bold">contribuição solidária.</div>
                <div className="mt-2 italic">Cada gesto transforma vidas.</div>
              </div>
            </div>
          </Card>

          {/* PIX QR Code */}
          {isPix && receipt.pix_url && (
            <Card className="p-8 bg-white/10 backdrop-blur-md border-red-300/20 print:hidden">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Pagamento PIX</h2>
              <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <QRCodeSVG value={receipt.pix_url} size={280} level="H" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-700 font-medium">Escaneie o QR Code com seu app de banco</p>
                  <p className="text-lg font-bold text-red-600">R$ {receipt.total_amount.toFixed(2)}</p>
                  {pixSettings.pix_key && (
                    <div className="pt-4 border-t mt-4">
                      <p className="text-xs text-gray-600 mb-2">
                        Chave PIX ({pixSettings.pix_key_type?.toUpperCase() || "Tipo"}):
                      </p>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{pixSettings.pix_key}</p>
                      <p className="text-xs text-gray-500 mt-2">{pixSettings.merchant_name || "Cáritas RS"}</p>
                    </div>
                  )}
                </div>
              </div>

              {isPending && (
                <div className="mt-6 space-y-3">
                  <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-4">
                    <p className="text-white text-sm text-center">⏳ Aguardando confirmação do pagamento</p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Actions - Hide on print */}
        <div className="flex gap-3 justify-center print:hidden">
          <Button onClick={handlePrint} className="bg-red-600 hover:bg-red-700 text-white">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Recibo
          </Button>
        </div>
      </div>
    </div>
  )
}
