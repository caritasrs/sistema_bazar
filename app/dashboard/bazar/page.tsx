"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductEntry } from "@/components/bazar/product-entry"
import { ProductList } from "@/components/bazar/product-list"
import { SalesInterface } from "@/components/bazar/sales-interface"
import { BatchManagement } from "@/components/bazar/batch-management"

export default function BazarPage() {
  const [activeTab, setActiveTab] = useState("sales")

  return (
    <div className="p-6 space-y-6">
      <div className="backdrop-blur-md bg-red-900/25 rounded-xl p-6 border border-red-300/20 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Gestão do Bazar</h1>
        <p className="text-white/90">Controle de mercadorias, vendas e estoque com QR Code</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-red-900/25 backdrop-blur-md border border-red-300/20 p-1">
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white text-white/70"
          >
            Vendas
          </TabsTrigger>
          <TabsTrigger
            value="entry"
            className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white text-white/70"
          >
            Entrada de Mercadorias
          </TabsTrigger>
          <TabsTrigger
            value="stock"
            className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white text-white/70"
          >
            Estoque
          </TabsTrigger>
          <TabsTrigger
            value="batches"
            className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white text-white/70"
          >
            Lotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <SalesInterface />
        </TabsContent>

        <TabsContent value="entry" className="mt-6">
          <ProductEntry />
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <ProductList />
        </TabsContent>

        <TabsContent value="batches" className="mt-6">
          <BatchManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
