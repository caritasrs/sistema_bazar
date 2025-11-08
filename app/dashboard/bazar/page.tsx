"use client"
import { SalesInterface } from "@/components/bazar/sales-interface"

export default function BazarPage() {
  // Removed tabs and kept only sales interface
  return (
    <div className="p-6 space-y-6">
      <div className="backdrop-blur-md bg-red-900/25 rounded-xl p-6 border border-red-300/20 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Realizar Venda</h1>
        <p className="text-white/90">Interface de vendas com leitura de QR Code e gestão de carrinho</p>
      </div>

      <SalesInterface />
    </div>
  )
}
