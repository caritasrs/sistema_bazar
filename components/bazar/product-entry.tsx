"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, X } from "lucide-react"

export function ProductEntry() {
  const [batches, setBatches] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [donors, setDonors] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDonor, setSelectedDonor] = useState<any>(null)
  const [showDonorSearch, setShowDonorSearch] = useState(false)

  const [formData, setFormData] = useState({
    batch_id: "",
    category_id: "",
    donor_id: "",
    description: "",
    size: "",
    condition: "bom",
    symbolic_value: "",
    origin: "",
  })

  useEffect(() => {
    fetchBatches()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchDonors()
    } else {
      setDonors([])
    }
  }, [searchTerm])

  const fetchBatches = async () => {
    const response = await fetch("/api/batches/list")
    const data = await response.json()
    setBatches(data.batches || [])
  }

  const fetchCategories = async () => {
    const response = await fetch("/api/categories/list")
    const data = await response.json()
    setCategories(data)
  }

  const searchDonors = async () => {
    try {
      const response = await fetch(`/api/donors/list?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setDonors(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error searching donors:", error)
      setDonors([])
    }
  }

  const handleDonorSelect = (donor: any) => {
    setSelectedDonor(donor)
    setFormData({ ...formData, donor_id: donor.id })
    setShowDonorSearch(false)
    setSearchTerm("")
  }

  const clearDonor = () => {
    setSelectedDonor(null)
    setFormData({ ...formData, donor_id: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Product entry form data:", formData)

    // Validate required fields
    if (!formData.description) {
      alert("Por favor, preencha a descrição do item")
      return
    }

    if (!formData.symbolic_value) {
      alert("Por favor, informe o valor simbólico")
      return
    }

    try {
      console.log("[v0] Sending item creation request...")
      const response = await fetch("/api/items/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Response status:", response.status)
      const result = await response.json()
      console.log("[v0] Response data:", result)

      if (!response.ok) {
        throw new Error(result.error || "Erro ao cadastrar item")
      }

      if (result.item) {
        alert(`Item cadastrado com sucesso!\nQR Code: ${result.item.qr_code}`)
        // Imprimir etiqueta
        window.open(`/labels/${result.item.qr_code}`, "_blank")
        // Resetar formulário
        setFormData({
          batch_id: "",
          category_id: "",
          donor_id: "",
          description: "",
          size: "",
          condition: "bom",
          symbolic_value: "",
          origin: "",
        })
        setSelectedDonor(null)
      }
    } catch (error: any) {
      console.error("[v0] Error creating item:", error)
      alert(`Erro ao cadastrar item: ${error.message}`)
    }
  }

  return (
    <Card className="p-6 bg-red-900/10 backdrop-blur-md border-red-300/20">
      <h2 className="text-2xl font-bold text-white mb-6">Entrada de Mercadorias</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="donor" className="text-white font-semibold">
              Doador
            </Label>
            {selectedDonor ? (
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex-1">
                  <p className="text-white font-semibold">{selectedDonor.name}</p>
                  <p className="text-white/70 text-sm">
                    {selectedDonor.type === "individual" ? "Pessoa Física" : "Pessoa Jurídica"} -{" "}
                    {selectedDonor.cpf_cnpj}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={clearDonor}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    id="donor"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowDonorSearch(true)
                    }}
                    onFocus={() => setShowDonorSearch(true)}
                    placeholder="Buscar por nome ou CPF/CNPJ"
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                  />
                  <Button type="button" onClick={searchDonors} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {showDonorSearch && donors.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                    {donors.map((donor) => (
                      <button
                        key={donor.id}
                        type="button"
                        onClick={() => handleDonorSelect(donor)}
                        className="w-full text-left p-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-semibold text-gray-900">{donor.name}</p>
                        <p className="text-sm text-gray-600">
                          {donor.type === "individual" ? "Pessoa Física" : "Pessoa Jurídica"} - {donor.cpf_cnpj}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="batch" className="text-white font-semibold">
              Lote de Doação
            </Label>
            <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value })}>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Selecione um lote (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.batch_number} - {batch.donor?.name || "Sem doador"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-white font-semibold">
              Categoria
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Selecione uma categoria (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-white font-semibold">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Camisa polo azul marinho"
              className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              required
            />
          </div>

          <div>
            <Label htmlFor="size" className="text-white font-semibold">
              Tamanho
            </Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              placeholder="Ex: M, GG, 42"
              className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
            />
          </div>

          <div>
            <Label htmlFor="condition" className="text-white font-semibold">
              Condição *
            </Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData({ ...formData, condition: value })}
              required
            >
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="muito_bom">Muito Bom</SelectItem>
                <SelectItem value="bom">Bom</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value" className="text-white font-semibold">
              Valor Simbólico (R$) *
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.symbolic_value}
              onChange={(e) => setFormData({ ...formData, symbolic_value: e.target.value })}
              placeholder="0.00"
              className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              required
            />
          </div>

          <div>
            <Label htmlFor="origin" className="text-white font-semibold">
              Origem
            </Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Ex: Renner, Alemanha, Local"
              className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-lg">
          <Plus className="h-5 w-5 mr-2" />
          Cadastrar e Gerar QR Code
        </Button>
      </form>
    </Card>
  )
}

export default ProductEntry
