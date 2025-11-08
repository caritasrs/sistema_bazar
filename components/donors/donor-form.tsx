"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCPF, formatCNPJ, formatPhone, formatCEP, validateCPF, validateCNPJ } from "@/lib/format-utils"
import { Search, CheckCircle, XCircle, Save } from "lucide-react"

export function DonorForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    cpf_cnpj: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    notes: "",
  })

  const [loadingCep, setLoadingCep] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (name: string, value: string) => {
    if (name === "cpf_cnpj") {
      const numbers = value.replace(/\D/g, "")
      if (formData.type === "pessoa_fisica") {
        value = formatCPF(numbers)
      } else if (formData.type === "pessoa_juridica") {
        value = formatCNPJ(numbers)
      }
    } else if (name === "phone") {
      value = formatPhone(value.replace(/\D/g, ""))
    } else if (name === "cep") {
      value = formatCEP(value.replace(/\D/g, ""))
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSearchCep = async () => {
    const cep = formData.cep.replace(/\D/g, "")
    if (cep.length !== 8) {
      setMessage({ type: "error", text: "CEP deve ter 8 dígitos" })
      return
    }

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData({
          ...formData,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        })
        setMessage({ type: "success", text: "CEP encontrado!" })
      } else {
        setMessage({ type: "error", text: "CEP não encontrado" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao buscar CEP" })
    } finally {
      setLoadingCep(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Submitting donor form:", formData)

    if (formData.type === "pessoa_fisica" && formData.cpf_cnpj && !validateCPF(formData.cpf_cnpj)) {
      setMessage({ type: "error", text: "CPF inválido" })
      return
    }
    if (formData.type === "pessoa_juridica" && formData.cpf_cnpj && !validateCNPJ(formData.cpf_cnpj)) {
      setMessage({ type: "error", text: "CNPJ inválido" })
      return
    }

    const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`

    try {
      const response = await fetch("/api/donors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          name: formData.name,
          cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ""),
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ""),
          address: fullAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          notes: formData.notes,
        }),
      })

      console.log("[v0] Create donor response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Donor created successfully:", result)
        setMessage({ type: "success", text: "Doador cadastrado com sucesso!" })
        setFormData({
          type: "",
          name: "",
          cpf_cnpj: "",
          email: "",
          phone: "",
          cep: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          country: "Brasil",
          notes: "",
        })
        if (onSuccess) {
          setTimeout(onSuccess, 1000)
        }
      } else {
        const error = await response.json()
        console.error("[v0] Error creating donor:", error)
        setMessage({ type: "error", text: error.error || "Erro ao cadastrar doador" })
      }
    } catch (error) {
      console.error("[v0] Error creating donor:", error)
      setMessage({ type: "error", text: "Erro ao cadastrar doador" })
    }
  }

  return (
    <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20">
      <CardHeader className="border-b border-red-300/20">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <Save className="w-6 h-6" />
          Cadastrar Novo Doador
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {message && (
          <Alert
            className={`mb-6 border-2 ${
              message.type === "error"
                ? "border-red-500 bg-red-50/95 backdrop-blur-sm"
                : "border-green-500 bg-green-50/95 backdrop-blur-sm"
            }`}
          >
            <AlertDescription
              className={`font-medium flex items-center gap-2 ${
                message.type === "error" ? "text-red-900" : "text-green-900"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-white font-semibold text-base">Tipo de Doador</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white h-12">
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
              <Label className="text-white font-semibold text-base">Nome / Razão Social</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                required
              />
            </div>

            <div>
              <Label className="text-white font-semibold text-base">
                {formData.type === "pessoa_fisica"
                  ? "CPF"
                  : formData.type === "pessoa_juridica"
                    ? "CNPJ"
                    : "CPF / CNPJ"}
              </Label>
              <Input
                value={formData.cpf_cnpj}
                onChange={(e) => handleChange("cpf_cnpj", e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                placeholder={formData.type === "pessoa_fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white font-semibold text-base">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
              />
            </div>

            <div>
              <Label className="text-white font-semibold text-base">Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-red-300/20 pt-6">
            <h4 className="text-white font-bold text-lg">Endereço</h4>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="cep" className="text-white font-semibold text-base">
                  CEP
                </Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={(e) => handleChange("cep", e.target.value)}
                  placeholder="00000-000"
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                  maxLength={9}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearchCep}
                  disabled={loadingCep}
                  className="bg-red-700/80 hover:bg-red-700 text-white h-12 px-6 font-bold backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {loadingCep ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_120px] gap-4">
              <div>
                <Label htmlFor="street" className="text-white font-semibold text-base">
                  Rua
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <div>
                <Label htmlFor="number" className="text-white font-semibold text-base">
                  Número
                </Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complement" className="text-white font-semibold text-base">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement}
                  onChange={(e) => handleChange("complement", e.target.value)}
                  placeholder="Apto, sala, etc."
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <div>
                <Label htmlFor="neighborhood" className="text-white font-semibold text-base">
                  Bairro
                </Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange("neighborhood", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-white font-semibold text-base">
                  Cidade
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-white font-semibold text-base">
                  Estado
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-white font-semibold text-base">
                  País
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50 h-12"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white font-semibold text-base">Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/10 backdrop-blur-sm border-red-300/30 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-red-700/80 hover:bg-red-700 text-white text-lg font-bold backdrop-blur-sm transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            Cadastrar Doador
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
