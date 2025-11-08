"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Trash2, CreditCard, DollarSign, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function SalesInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [qrCode, setQrCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("cash")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [operatorName, setOperatorName] = useState("")

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
      alert("Venda realizada com sucesso!")
      setCart([])
      setSelectedCustomerId("")
      // Abrir impressão do recibo
      window.open(`/receipts/${result.receipt.id}`, "_blank")
    } catch (error) {
      console.error("[v0] Checkout exception:", error)
      alert("Erro ao processar venda")
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
              <p className="text-white/80">Pagamento em dinheiro. O recibo será impresso após a confirmação.</p>
            </TabsContent>

            <TabsContent value="pix" className="space-y-4 mt-4">
              <p className="text-white/80">O QR Code do PIX será gerado no recibo para pagamento.</p>
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
            Finalizar Venda e Imprimir Recibo
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
    </div>
  )
}
