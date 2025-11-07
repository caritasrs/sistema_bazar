"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DonorForm() {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    cpf_cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Brasil",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/donors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Doador cadastrado com sucesso!")
        setFormData({
          type: "",
          name: "",
          cpf_cnpj: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "Brasil",
          notes: "",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating donor:", error)
      alert("Erro ao cadastrar doador")
    }
  }

  return (
    <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
      <CardHeader>
        <CardTitle className="text-white">Cadastrar Novo Doador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Tipo de Doador</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-white/90 text-gray-900">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                <SelectItem value="international">Internacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Nome / Razão Social</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/90 text-gray-900"
                required
              />
            </div>

            <div>
              <Label className="text-white">CPF / CNPJ</Label>
              <Input
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>

            <div>
              <Label className="text-white">Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Endereço</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-white/90 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>

            <div>
              <Label className="text-white">Estado</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="bg-white/90 text-gray-900"
                maxLength={2}
              />
            </div>

            <div>
              <Label className="text-white">País</Label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/90 text-gray-900"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Cadastrar Doador
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
