"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CampaignCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    campaign_type: "",
    target_segment: "",
    start_date: "",
    end_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Campanha criada com sucesso!")
        setFormData({
          title: "",
          description: "",
          campaign_type: "",
          target_segment: "",
          start_date: "",
          end_date: "",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating campaign:", error)
      alert("Erro ao criar campanha")
    }
  }

  return (
    <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
      <CardHeader>
        <CardTitle className="text-white">Criar Nova Campanha</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Título da Campanha</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-white/90 text-gray-900"
              required
            />
          </div>

          <div>
            <Label className="text-white">Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/90 text-gray-900"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Tipo de Campanha</Label>
              <Select
                value={formData.campaign_type}
                onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
              >
                <SelectTrigger className="bg-white/90 text-gray-900">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="institutional">Institucional</SelectItem>
                  <SelectItem value="promotional">Promocional</SelectItem>
                  <SelectItem value="seasonal">Sazonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Segmento Alvo</Label>
              <Select
                value={formData.target_segment}
                onValueChange={(value) => setFormData({ ...formData, target_segment: value })}
              >
                <SelectTrigger className="bg-white/90 text-gray-900">
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="frequent_buyers">Compradores Frequentes</SelectItem>
                  <SelectItem value="age_group">Faixa Etária</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Data de Início</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>

            <div>
              <Label className="text-white">Data de Término</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-white/90 text-gray-900"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Criar Campanha
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
