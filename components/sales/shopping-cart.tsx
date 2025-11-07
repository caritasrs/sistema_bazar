"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format-utils"
import { X } from "lucide-react"

interface CartItem {
  item_id: string
  description: string
  unit_price: number
  quantity: number
}

interface ShoppingCartProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  customerName: string
  onCheckout: (items: CartItem[], paymentMethod: string) => void
  loading?: boolean
}

export function ShoppingCart({
  items,
  onRemoveItem,
  onQuantityChange,
  customerName,
  onCheckout,
  loading,
}: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const handleCheckout = (method: string) => {
    if (items.length === 0) {
      alert("Carrinho vazio")
      return
    }
    onCheckout(items, method)
  }

  return (
    <Card className="bg-white/80 border-red-200 sticky top-4">
      <CardHeader>
        <CardTitle>Carrinho de Compras</CardTitle>
        <CardDescription>Cliente: {customerName || "Não selecionado"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum item no carrinho</div>
          ) : (
            items.map((item) => (
              <div key={item.item_id} className="bg-red-50 p-3 rounded-lg flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.description}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(item.unit_price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.item_id, Number.parseInt(e.target.value) || 1)}
                    className="w-12 h-8"
                  />
                  <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.item_id)} className="text-red-600">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t-2 border-red-200 pt-4 space-y-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-red-600">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => handleCheckout("pix")}
            disabled={loading || items.length === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Pagar com PIX
          </Button>
          <Button
            onClick={() => handleCheckout("cash")}
            disabled={loading || items.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Dinheiro em Espécie
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
