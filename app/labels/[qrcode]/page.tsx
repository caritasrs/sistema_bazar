"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default function LabelPage() {
  const params = useParams()
  const qrcode = params.qrcode as string
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItem()
  }, [qrcode])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/get?qr_code=${qrcode}`)
      const data = await response.json()
      if (data.item) {
        setItem(data.item)
      }
    } catch (error) {
      console.error("Error fetching item:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Carregando...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Item não encontrado</h1>
          <p className="text-gray-600">QR Code: {qrcode}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="print:hidden mb-4 flex gap-2">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Etiqueta
          </Button>
          <Button onClick={() => window.close()} variant="outline">
            Fechar
          </Button>
        </div>

        {/* Label for printing */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 print:shadow-none print:border-black">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-red-800">Bazar Solidário</h1>
            <p className="text-sm text-gray-600">Cáritas RS</p>
          </div>

          <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-2 break-words">{item.description}</p>
            {item.size && <p className="text-sm text-gray-600">Tamanho: {item.size}</p>}
            {item.condition && (
              <p className="text-sm text-gray-600">
                Condição:{" "}
                {
                  {
                    novo: "Novo",
                    muito_bom: "Muito Bom",
                    bom: "Bom",
                    usado: "Usado",
                  }[item.condition]
                }
              </p>
            )}
          </div>

          <div className="flex justify-center mb-4">
            <QRCodeSVG value={item.qr_code} size={200} level="H" includeMargin />
          </div>

          <div className="text-center">
            <p className="text-xs font-mono text-gray-500 mb-2">{item.qr_code}</p>
            <p className="text-2xl font-bold text-red-700">
              R$ {Number.parseFloat(item.symbolic_value || "0").toFixed(2)}
            </p>
          </div>

          {item.origin && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Origem: {item.origin}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}
