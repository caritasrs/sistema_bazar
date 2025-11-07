"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QRScannerProps {
  onItemScanned: (item: any) => void
  onError: (error: string) => void
}

export function QRScanner({ onItemScanned, onError }: QRScannerProps) {
  const [manualQR, setManualQR] = useState("")
  const [loading, setLoading] = useState(false)

  const handleScan = async (qrCode: string) => {
    if (!qrCode.trim()) {
      onError("QR code vazio")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/sales/scan-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code: qrCode }),
      })

      if (!response.ok) {
        const error = await response.json()
        onError(error.error || "Item não encontrado")
        return
      }

      const item = await response.json()
      onItemScanned(item)
      setManualQR("")
    } catch (error) {
      onError("Erro ao ler QR code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>Leitor de QR Code</CardTitle>
        <CardDescription>Escaneie ou digite o código do produto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Código QR ou ID do Produto</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Escaneie aqui..."
              value={manualQR}
              onChange={(e) => setManualQR(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleScan(manualQR)
                }
              }}
              disabled={loading}
              autoFocus
            />
            <Button
              onClick={() => handleScan(manualQR)}
              disabled={loading || !manualQR.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Processando..." : "Buscar"}
            </Button>
          </div>
        </div>
        <Alert>
          <AlertDescription className="text-sm">
            Conecte um leitor de código de barras ou digite manualmente
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
