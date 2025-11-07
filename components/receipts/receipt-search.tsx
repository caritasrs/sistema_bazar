"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ReceiptView } from "@/components/receipt/receipt-view"

export function ReceiptSearch() {
  const [receiptNumber, setReceiptNumber] = useState("")
  const [searchedNumber, setSearchedNumber] = useState("")

  const handleSearch = () => {
    setSearchedNumber(receiptNumber)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
        <CardHeader>
          <CardTitle className="text-white">Buscar Recibo por Número</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o número do recibo (ex: R001234)"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white/90 text-gray-900"
            />
            <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchedNumber && <ReceiptView receiptNumber={searchedNumber} />}
    </div>
  )
}
