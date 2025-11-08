"use client"

import { useState, useEffect } from "react"
import { Package, Search, Pencil, Trash2, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Item {
  id: string
  description: string
  symbolic_value: number
  condition: string
  size?: string
  status: string
  origin?: string
  category_id?: string
  batch_id?: string
  donor_id?: string
  category?: { id: string; name: string }
  batch?: { id: string; batch_code: string }
  donor?: { id: string; name: string }
  qr_code?: string
}

interface Category {
  id: string
  name: string
}

interface Batch {
  id: string
  batch_code: string
}

interface Donor {
  id: string
  name: string
}

export default function InventoryList() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [donors, setDonors] = useState<Donor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Item | null>(null)
  const [viewingQRCode, setViewingQRCode] = useState<Item | null>(null)

  useEffect(() => {
    fetchItems()
    fetchCategories()
    fetchBatches()
    fetchDonors()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items/list")
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error("[v0] Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/list")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    }
  }

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/batches/list")
      const data = await response.json()
      setBatches(data.batches || [])
    } catch (error) {
      console.error("[v0] Error fetching batches:", error)
    }
  }

  const fetchDonors = async () => {
    try {
      const response = await fetch("/api/donors/list")
      const data = await response.json()
      setDonors(data || [])
    } catch (error) {
      console.error("[v0] Error fetching donors:", error)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/items/update/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editingItem.description,
          symbolic_value: editingItem.symbolic_value,
          condition: editingItem.condition,
          size: editingItem.size,
          origin: editingItem.origin,
          category_id: editingItem.category_id,
          batch_id: editingItem.batch_id,
          donor_id: editingItem.donor_id,
        }),
      })

      if (response.ok) {
        await fetchItems()
        setEditingItem(null)
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao atualizar item")
      }
    } catch (error) {
      console.error("[v0] Error updating item:", error)
      alert("Erro ao atualizar item")
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    try {
      const response = await fetch(`/api/items/delete/${deleteConfirm.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchItems()
        setDeleteConfirm(null)
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao excluir item")
      }
    } catch (error) {
      console.error("[v0] Error deleting item:", error)
      alert("Erro ao excluir item")
    }
  }

  const filteredItems = items.filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()))

  const availableItems = filteredItems.filter((item) => item.status === "available")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos no estoque..."
            className="pl-10 bg-white/10 border-red-300/20 text-white placeholder:text-red-200"
          />
        </div>
        <div className="text-white font-semibold">Total: {availableItems.length} itens disponíveis</div>
      </div>

      {loading ? (
        <div className="text-center text-white py-8">Carregando estoque...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-red-300/20 hover:border-red-300/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Package className="h-5 w-5 text-red-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.description}</h3>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-red-100">Valor: R$ {item.symbolic_value.toFixed(2)}</p>
                    <p className="text-sm text-red-100">Condição: {item.condition}</p>
                    {item.size && <p className="text-sm text-red-100">Tamanho: {item.size}</p>}
                    {item.category && <p className="text-xs text-red-200">Categoria: {item.category.name}</p>}
                    {item.batch && <p className="text-xs text-red-200">Lote: {item.batch.batch_code}</p>}
                    <p className="text-xs text-red-300 font-mono">QR: {item.qr_code || item.id}</p>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Button
                      onClick={() => setViewingQRCode(item)}
                      size="sm"
                      variant="outline"
                      className="bg-purple-600/20 border-purple-400/40 text-purple-100 hover:bg-purple-600/30 hover:text-white"
                    >
                      <QrCode className="h-3 w-3 mr-1" />
                      QR Code
                    </Button>
                    <Button
                      onClick={() => setEditingItem(item)}
                      size="sm"
                      variant="outline"
                      className="bg-blue-600/20 border-blue-400/40 text-blue-100 hover:bg-blue-600/30 hover:text-white"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm(item)}
                      size="sm"
                      variant="outline"
                      className="bg-red-600/20 border-red-400/40 text-red-100 hover:bg-red-600/30 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!viewingQRCode} onOpenChange={() => setViewingQRCode(null)}>
        <DialogContent className="bg-red-950/95 border-red-300/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">QR Code do Produto</DialogTitle>
            <DialogDescription className="text-red-200">
              Visualize e imprima o QR Code para identificação do produto
            </DialogDescription>
          </DialogHeader>

          {viewingQRCode && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-lg">{viewingQRCode.description}</h3>
                    <p className="text-gray-600 text-sm">
                      {viewingQRCode.size && `Tamanho: ${viewingQRCode.size} | `}
                      Condição: {viewingQRCode.condition}
                    </p>
                    <p className="text-red-600 font-bold text-xl mt-2">R$ {viewingQRCode.symbolic_value.toFixed(2)}</p>
                  </div>
                  <div className="border-4 border-gray-800 p-4 rounded-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${viewingQRCode.qr_code || viewingQRCode.id}`}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-gray-500 text-xs font-mono">{viewingQRCode.qr_code || viewingQRCode.id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const qrValue = viewingQRCode.qr_code || viewingQRCode.id
                    window.open(`/labels/${qrValue}`, "_blank")
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Imprimir Etiqueta
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingQRCode(null)}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-red-950/95 border-red-300/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Editar Produto</DialogTitle>
            <DialogDescription className="text-red-200">Altere as informações do produto no estoque</DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Descrição *</Label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="bg-white/10 border-red-300/20 text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Valor Simbólico (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem.symbolic_value}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, symbolic_value: Number.parseFloat(e.target.value) })
                    }
                    className="bg-white/10 border-red-300/20 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Condição *</Label>
                  <Select
                    value={editingItem.condition}
                    onValueChange={(value) => setEditingItem({ ...editingItem, condition: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-red-300/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="usado_bom">Usado - Bom Estado</SelectItem>
                      <SelectItem value="usado_regular">Usado - Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Tamanho</Label>
                  <Input
                    value={editingItem.size || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })}
                    className="bg-white/10 border-red-300/20 text-white"
                    placeholder="Ex: M, 42, GG"
                  />
                </div>

                <div>
                  <Label className="text-white">Origem</Label>
                  <Input
                    value={editingItem.origin || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, origin: e.target.value })}
                    className="bg-white/10 border-red-300/20 text-white"
                    placeholder="Ex: Doação"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Categoria</Label>
                <Select
                  value={editingItem.category_id || "default"}
                  onValueChange={(value) => setEditingItem({ ...editingItem, category_id: value })}
                >
                  <SelectTrigger className="bg-white/10 border-red-300/20 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Nenhuma</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Lote de Doação</Label>
                <Select
                  value={editingItem.batch_id || "default"}
                  onValueChange={(value) => setEditingItem({ ...editingItem, batch_id: value })}
                >
                  <SelectTrigger className="bg-white/10 border-red-300/20 text-white">
                    <SelectValue placeholder="Selecione um lote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Nenhum</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batch_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Doador</Label>
                <Select
                  value={editingItem.donor_id || "default"}
                  onValueChange={(value) => setEditingItem({ ...editingItem, donor_id: value })}
                >
                  <SelectTrigger className="bg-white/10 border-red-300/20 text-white">
                    <SelectValue placeholder="Selecione um doador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Nenhum</SelectItem>
                    {donors.map((donor) => (
                      <SelectItem key={donor.id} value={donor.id}>
                        {donor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="bg-white/10 text-white">
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-red-950/95 border-red-300/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-red-200">
              Tem certeza que deseja excluir este produto do estoque?
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (
            <div className="py-4">
              <p className="text-white font-semibold">{deleteConfirm.description}</p>
              <p className="text-red-200 text-sm mt-2">Esta ação não pode ser desfeita.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="bg-white/10 text-white">
              Cancelar
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
