"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search } from "lucide-react"

interface ClientFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    cpf: "",
    password: "",
    phone: "",
    address: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSearchCep = async () => {
    const cep = formData.cep.replace(/\D/g, "")
    if (cep.length !== 8) {
      setMessage({ type: "error", text: "CEP deve ter 8 dígitos" })
      return
    }

    setLoadingCep(true)
    setMessage(null)
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
  // </CHANGE>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`

    console.log("[v0] Creating client with data:", { ...formData, password: "***", address: fullAddress })

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          cpf: formData.cpf,
          password: formData.password,
          phone: formData.phone,
          address: fullAddress,
          role: "client",
        }),
      })

      const data = await response.json()
      console.log("[v0] Client creation response:", { success: response.ok, data })

      if (response.ok) {
        setMessage({ type: "success", text: "Cliente criado com sucesso!" })
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        setMessage({ type: "error", text: data.error || "Erro ao criar cliente" })
      }
    } catch (error) {
      console.error("[v0] Client creation error:", error)
      setMessage({ type: "error", text: "Erro ao conectar ao servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white">
            Nome Completo
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Maria Silva"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-white">
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="maria@email.com"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        <div>
          <Label htmlFor="cpf" className="text-white">
            CPF
          </Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="123.456.789-00"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">
            Telefone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(51) 98765-4321"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="space-y-4 p-4 bg-white/5 rounded-lg">
        <h4 className="text-white font-medium">Endereço</h4>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="cep" className="text-white">
              CEP
            </Label>
            <Input
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
              maxLength={9}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleSearchCep}
              disabled={loadingCep}
              className="bg-red-600 hover:bg-red-700"
            >
              <Search className="w-4 h-4" />
              {loadingCep ? " Buscando..." : " Buscar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="street" className="text-white">
              Rua
            </Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Rua das Flores"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="number" className="text-white">
              Número
            </Label>
            <Input
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="123"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="complement" className="text-white">
              Complemento
            </Label>
            <Input
              id="complement"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
              placeholder="Apto 201"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="neighborhood" className="text-white">
              Bairro
            </Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Centro"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-white">
              Cidade
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Porto Alegre"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-white">
              Estado
            </Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="RS"
              maxLength={2}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </div>
      {/* </CHANGE> */}

      <div>
        <Label htmlFor="password" className="text-white">
          Senha (mínimo 8 caracteres)
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
          {loading ? "Criando..." : "Criar Cliente"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 bg-transparent text-white border-white/30 hover:bg-white/20"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
