"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Trash2, CreditCard, DollarSign, Printer, CheckCircle, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface CartItem {
  id: string
  qr_code: string
  description: string
  symbolic_value: number
  quantity: number
}

interface Customer {
  id: string
  name: string
  cpf: string
}

interface PendingPayment {
  receiptId: string
  receiptNumber: string
  pixPayload: string
  amount: number
  merchantName: string
  pixKey: string
}

export function SalesInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [qrCode, setQrCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("cash")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [operatorName, setOperatorName] = useState("")

  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null)
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false)

  useEffect(() => {
    loadCustomers()
    loadOperatorInfo()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/clients/list")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.clients || [])
      }
    } catch (error) {
      console.error("[v0] Error loading customers:", error)
    }
  }

  const loadOperatorInfo = async () => {
    try {
      const response = await fetch("/api/auth/verify-session")
      if (response.ok) {
        const data = await response.json()
        setOperatorName(data.user?.name || data.user?.email || "Operador")
      }
    } catch (error) {
      console.error("[v0] Error loading operator info:", error)
    }
  }

  const handleScanQRCode = async () => {
    if (!qrCode.trim()) return

    setIsScanning(true)
    try {
      const response = await fetch("/api/sales/scan-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code: qrCode }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Item não encontrado ou já vendido")
        return
      }

      const item = await response.json()

      const existingItem = cart.find((i) => i.qr_code === qrCode)
      if (existingItem) {
        setCart(cart.map((i) => (i.qr_code === qrCode ? { ...i, quantity: i.quantity + 1 } : i)))
      } else {
        setCart([...cart, { ...item, quantity: 1 }])
      }
      setQrCode("")
    } catch (error) {
      alert("Erro ao buscar item")
    } finally {
      setIsScanning(false)
    }
  }

  const removeFromCart = (qrCode: string) => {
    setCart(cart.filter((item) => item.qr_code !== qrCode))
  }

  const total = cart.reduce((sum, item) => sum + item.symbolic_value * item.quantity, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio")
      return
    }

    if (!selectedCustomerId) {
      alert("Por favor, selecione um cliente para a venda")
      return
    }

    try {
      console.log("[v0] Starting checkout with customer:", selectedCustomerId)
      const response = await fetch("/api/sales/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          items: cart.map((item) => ({
            item_id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.symbolic_value,
          })),
          payment_method: paymentMethod,
          operator_name: operatorName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Checkout error:", errorData)
        alert(errorData.error || "Erro ao processar venda")
        return
      }

      const result = await response.json()
      console.log("[v0] Checkout successful:", result)

      if (paymentMethod === "pix") {
        // Fetch PIX settings for display
        const settingsResponse = await fetch("/api/settings/get")
        const settingsData = await settingsResponse.json()

        setPendingPayment({
          receiptId: result.receipt.id,
          receiptNumber: result.receipt.receipt_number,
          pixPayload: result.receipt.pix_url,
          amount: result.receipt.total_amount,
          merchantName: settingsData.settings.merchant_name || "Cáritas RS",
          pixKey: settingsData.settings.pix_key || "",
        })
      } else {
        alert("Venda realizada com sucesso!")
        setCart([])
        setSelectedCustomerId("")
        window.open(`/receipts/${result.receipt.id}`, "_blank")
      }
    } catch (error) {
      console.error("[v0] Checkout exception:", error)
      alert("Erro ao processar venda")
    }
  }

  const handleConfirmPixPayment = async () => {
    if (!pendingPayment) return

    setIsConfirmingPayment(true)
    try {
      const response = await fetch("/api/receipts/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_id: pendingPayment.receiptId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || "Erro ao confirmar pagamento")
        return
      }

      alert("Pagamento confirmado! Venda finalizada com sucesso.")

      // Clear cart and show receipt
      setCart([])
      setSelectedCustomerId("")
      window.open(`/receipts/${pendingPayment.receiptId}`, "_blank")
      setPendingPayment(null)
    } catch (error) {
      console.error("[v0] Error confirming payment:", error)
      alert("Erro ao confirmar pagamento")
    } finally {
      setIsConfirmingPayment(false)
    }
  }

  const handleCancelPixPayment = () => {
    if (confirm("Deseja cancelar este pagamento PIX? Os itens voltarão ao estoque.")) {
      setPendingPayment(null)
      // Could call API to cancel the receipt and unreserve items
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Scanner e Carrinho */}
      <Card className="p-6 bg-red-900/10 backdrop-blur-md border-red-300/20">
        <h2 className="text-xl font-bold text-white mb-4">Scanner de Produtos</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="qr-code" className="text-white">
              Código QR
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="qr-code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleScanQRCode()}
                placeholder="Digite ou escaneie o código QR"
                className="bg-white/90 text-gray-900"
                autoFocus
              />
              <Button
                onClick={handleScanQRCode}
                disabled={isScanning}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Carrinho */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-white/70 text-center py-8">Nenhum item no carrinho</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.qr_code}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.description}</p>
                    <p className="text-white/70 text-sm">
                      R$ {item.symbolic_value.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-bold">R$ {(item.symbolic_value * item.quantity).toFixed(2)}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.qr_code)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-red-300/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-lg">Total:</span>
                <span className="text-white text-2xl font-bold">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Pagamento */}
      <Card className="p-6 bg-red-900/10 backdrop-blur-md border-red-300/20">
        <h2 className="text-xl font-bold text-white mb-4">Pagamento</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="customer" className="text-white">
              Cliente
            </Label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="bg-white/90 text-gray-900 mt-2">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "pix" | "cash")}>
            <TabsList className="grid w-full grid-cols-2 bg-red-900/20">
              <TabsTrigger value="cash" className="data-[state=active]:bg-red-700/50">
                <DollarSign className="h-4 w-4 mr-2" />
                Dinheiro
              </TabsTrigger>
              <TabsTrigger value="pix" className="data-[state=active]:bg-red-700/50">
                <CreditCard className="h-4 w-4 mr-2" />
                PIX
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cash" className="space-y-4 mt-4">
              <p className="text-white/80">
                Pagamento em dinheiro. A venda será finalizada imediatamente e o recibo será impresso.
              </p>
            </TabsContent>

            <TabsContent value="pix" className="space-y-4 mt-4">
              <div className="bg-blue-500/20 border border-blue-300/30 rounded-lg p-4">
                <p className="text-white/90 text-sm">
                  <strong>Como funciona:</strong>
                </p>
                <ol className="text-white/80 text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>Clique em "Finalizar Venda"</li>
                  <li>O QR Code PIX será gerado</li>
                  <li>Cliente escaneia e paga</li>
                  <li>Confirme o pagamento recebido</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedCustomerId}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-lg"
          >
            <Printer className="h-5 w-5 mr-2" />
            {paymentMethod === "pix" ? "Gerar QR Code PIX" : "Finalizar Venda"}
          </Button>

          {cart.length > 0 && (
            <Button
              onClick={() => setCart([])}
              variant="outline"
              className="w-full border-red-300/30 text-white hover:bg-red-900/30"
            >
              Limpar Carrinho
            </Button>
          )}
        </div>
      </Card>

      <Dialog open={!!pendingPayment} onOpenChange={(open) => !open && handleCancelPixPayment()}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Pagamento PIX Pendente</DialogTitle>
            <DialogDescription className="text-gray-600">Aguardando confirmação de pagamento</DialogDescription>
          </DialogHeader>

          {pendingPayment && (
            <div className="space-y-6">
              {/* QR Code Display */}
              <div className="flex flex-col items-center space-y-3 p-6 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Escaneie o QR Code para pagar:</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pendingPayment.pixPayload)}`}
                    alt="QR Code PIX"
                    className="w-64 h-64"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">Chave PIX: {pendingPayment.pixKey}</p>
                  <p className="text-xs text-gray-500">{pendingPayment.merchantName}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Recibo:</span>
                  <span className="text-sm font-medium text-gray-900">{pendingPayment.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Valor:</span>
                  <span className="text-lg font-bold text-gray-900">R$ {pendingPayment.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium mb-2">Instruções:</p>
                <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Cliente escaneia o QR Code com app do banco</li>
                  <li>Cliente confirma o pagamento no app</li>
                  <li>Verifique se o pagamento caiu na conta</li>
                  <li>Clique em "Efetivar Venda" após confirmar o pagamento</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleConfirmPixPayment}
                  disabled={isConfirmingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isConfirmingPayment ? "Confirmando..." : "Efetivar Venda"}
                </Button>

                <Button
                  onClick={handleCancelPixPayment}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
