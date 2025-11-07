"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CampaignFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
}

export function CampaignForm({ onSubmit, loading }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    campaign_type: "institutional",
    start_date: "",
    end_date: "",
    target_segment: "all",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert("Preencha todos os campos obrigatórios")
      return
    }
    onSubmit(formData)
  }

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>Nova Campanha</CardTitle>
        <CardDescription>Crie campanhas institucionais e comunicados solidários</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Título da Campanha</Label>
          <Input
            placeholder="Ex: Campanha de Doações - Inverno 2025"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <Label>Descrição</Label>
          <Textarea
            placeholder="Descreva o objetivo da campanha"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tipo de Campanha</Label>
            <Select value={formData.campaign_type} onValueChange={(value) => handleChange("campaign_type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institutional">Institucional</SelectItem>
                <SelectItem value="promotional">Promocional</SelectItem>
                <SelectItem value="seasonal">Sazonal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Público-Alvo</Label>
            <Select value={formData.target_segment} onValueChange={(value) => handleChange("target_segment", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="frequent_buyers">Compradores Frequentes</SelectItem>
                <SelectItem value="new_customers">Novos Clientes</SelectItem>
                <SelectItem value="age_18_30">18-30 anos</SelectItem>
                <SelectItem value="age_31_60">31-60 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label>Data Final</Label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
          {loading ? "Criando..." : "Criar Campanha"}
        </Button>
      </CardContent>
    </Card>
  )
}
