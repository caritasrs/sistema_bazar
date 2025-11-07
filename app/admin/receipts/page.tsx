"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ReceiptView } from "@/components/receipt/receipt-view"
import { formatDateTime, formatCurrency } from "@/lib/format-utils"

export default function ReceiptsPage() {
  const [searchType, setSearchType] = useState<"number" | "id">("number")
  const [searchValue, setSearchValue] = useState("")
  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchValue.trim()) return

    setLoading(true)
    try {
      // Fetch all receipts for listing (in production, implement proper pagination)
      const response = await fetch("/api/receipts/list")
      if (response.ok) {
        const data = await response.json()
        const filtered = data.filter((r: any) =>
          searchType === "number" ? r.receipt_number.includes(searchValue) : r.id.includes(searchValue),
        )
        setReceipts(filtered.slice(0, 10))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Recibos</h1>
        <p className="text-gray-600">Gestão de Recibos Personalizados com Branding Cáritas RS</p>
      </div>

      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Buscar Recibo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipo de Busca</Label>
            <div className="flex gap-2">
              <Button
                variant={searchType === "number" ? "default" : "outline"}
                onClick={() => setSearchType("number")}
                className={searchType === "number" ? "bg-red-600" : ""}
              >
                Número
              </Button>
              <Button
                variant={searchType === "id" ? "default" : "outline"}
                onClick={() => setSearchType("id")}
                className={searchType === "id" ? "bg-red-600" : ""}
              >
                ID
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={searchType === "number" ? "RCP-..." : "ID do recibo"}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
            />
            <Button onClick={handleSearch} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchValue && receipts.length > 0 && (
        <Card className="bg-white/80 border-red-200">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>{receipts.length} recibo(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {receipts.map((receipt) => (
                <Card
                  key={receipt.id}
                  className="bg-red-50 border-red-100 p-3 cursor-pointer hover:bg-red-100"
                  onClick={() => setSearchValue(receipt.receipt_number)}
                >
                  <div className="font-semibold text-red-700">{receipt.receipt_number}</div>
                  <div className="text-xs text-gray-600">{formatDateTime(receipt.created_at)}</div>
                  <div className="text-xs font-semibold text-red-600">{formatCurrency(receipt.total_amount)}</div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchValue && <ReceiptView receiptNumber={searchType === "number" ? searchValue : undefined} />}
    </div>
  )
}
