"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package } from "lucide-react"

export function ProductList() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("available")

  useEffect(() => {
    fetchItems()
  }, [filter])

  const fetchItems = async () => {
    const response = await fetch(`/api/bazar/items?status=${filter}`)
    const data = await response.json()
    setItems(data)
  }

  const filteredItems = items.filter(
    (item) =>
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.qr_code.toLowerCase().includes(search.toLowerCase()),
  )

  const statusColors = {
    available: "bg-green-500",
    sold: "bg-gray-500",
    reserved: "bg-yellow-500",
    damaged: "bg-red-500",
  }

  const statusLabels = {
    available: "Disponível",
    sold: "Vendido",
    reserved: "Reservado",
    damaged: "Danificado",
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-red-900/10 backdrop-blur-md border-red-300/20">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descrição ou QR Code..."
              className="pl-10 bg-white/90 text-gray-900"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/90 text-gray-900 border border-gray-300"
          >
            <option value="available">Disponíveis</option>
            <option value="sold">Vendidos</option>
            <option value="reserved">Reservados</option>
            <option value="damaged">Danificados</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <Card className="col-span-full p-12 bg-red-900/10 backdrop-blur-md border-red-300/20 text-center">
            <Package className="h-12 w-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">Nenhum item encontrado</p>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 bg-red-900/10 backdrop-blur-md border-red-300/20 hover:bg-red-900/20 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <Badge className={`${statusColors[item.status as keyof typeof statusColors]} text-white`}>
                  {statusLabels[item.status as keyof typeof statusLabels]}
                </Badge>
                <span className="text-white/70 text-sm font-mono">{item.qr_code}</span>
              </div>

              <h3 className="text-white font-medium mb-2">{item.description}</h3>

              <div className="space-y-1 text-sm text-white/80">
                {item.size && <p>Tamanho: {item.size}</p>}
                <p>Condição: {item.condition}</p>
                {item.origin && <p>Origem: {item.origin}</p>}
                <p className="text-lg font-bold text-white mt-2">
                  R$ {Number.parseFloat(item.symbolic_value).toFixed(2)}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
