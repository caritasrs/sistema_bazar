"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReceiptSearch } from "@/components/receipts/receipt-search"
import { ReceiptHistory } from "@/components/receipts/receipt-history"

export default function RecibosPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-lg p-6 border border-red-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Gestão de Recibos</h1>
        <p className="text-white/90">Consulte e gerencie recibos de vendas do bazar</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="bg-red-900/25 backdrop-blur-md border border-red-800/30">
          <TabsTrigger value="search" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Buscar Recibo
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <ReceiptSearch />
        </TabsContent>

        <TabsContent value="history">
          <ReceiptHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
