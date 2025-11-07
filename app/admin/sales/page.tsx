"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QRScanner } from "@/components/sales/qr-scanner"
import { ShoppingCart } from "@/components/sales/shopping-cart"

interface CartItem {
  item_id: string
  description: string
  unit_price: number
  quantity: number
}

export default function SalesPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerCPF, setCustomerCPF] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [operatorName, setOperatorName] = useState("")
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleItemScanned = (item: any) => {
    const existingItem = cartItems.find((ci) => ci.item_id === item.id)

    if (existingItem) {
      setCartItems(cartItems.map((ci) => (ci.item_id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci)))
    } else {
      setCartItems([
        ...cartItems,
        {
          item_id: item.id,
          description: item.description,
          unit_price: item.symbolic_value,
          quantity: 1,
        },
      ])
    }

    setMessage({ type: "success", text: `${item.description} adicionado ao carrinho` })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.item_id !== itemId))
  }

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId)
      return
    }
    setCartItems(cartItems.map((item) => (item.item_id === itemId ? { ...item, quantity } : item)))
  }

  const handleCheckout = async (items: CartItem[], paymentMethod: string) => {
    if (!customerCPF || !customerName || !operatorName) {
      setMessage({ type: "error", text: "Preencha todos os dados do cliente" })
      return
    }

    setLoading(true)
    try {
      // Create or get customer first
      const { data: customer } = await fetch("/api/crm/get-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: customerCPF }),
      }).then((r) => r.json())

      const response = await fetch("/api/sales/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer?.id || "temp-id",
          items,
          payment_method: paymentMethod,
          operator_name: operatorName,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar venda")
      }

      const receipt = await response.json()
      setMessage({ type: "success", text: `Venda concluída! Recibo: ${receipt.receipt.receipt_number}` })

      setCartItems([])
      setCustomerCPF("")
      setCustomerName("")

      // TODO: Open print preview for receipt
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao processar venda" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Ponto de Venda</h1>
        <p className="text-gray-600">Saída de Mercadorias - Vendas Simbólicas</p>
      </div>

      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CPF do Cliente</Label>
                  <Input
                    placeholder="123.456.789-00"
                    value={customerCPF}
                    onChange={(e) => setCustomerCPF(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    placeholder="Nome completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Operador</Label>
                <Input
                  placeholder="Nome do operador de caixa"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <QRScanner
            onItemScanned={handleItemScanned}
            onError={(error) => setMessage({ type: "error", text: error })}
          />
        </div>

        <div>
          <ShoppingCart
            items={cartItems}
            onRemoveItem={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
            customerName={customerName}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
