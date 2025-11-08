"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search } from "lucide-react"
import { formatCPF, formatPhone, formatCEP, validateCPF, validateEmail } from "@/lib/format-utils"

interface UserFormProps {
  roleToCreate: "admin" | "operator" | "client"
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ roleToCreate, onSuccess, onCancel }: UserFormProps) {
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
  const [checkingCpf, setCheckingCpf] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [checkingPhone, setCheckingPhone] = useState(false)
  const [cpfExists, setCpfExists] = useState<{ exists: boolean; user?: string } | null>(null)
  const [emailExists, setEmailExists] = useState<{ exists: boolean; user?: string } | null>(null)
  const [phoneExists, setPhoneExists] = useState<{ exists: boolean; user?: string } | null>(null)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    if (name === "cpf") {
      setCpfExists(null)
      value = formatCPF(value.replace(/\D/g, ""))
    } else if (name === "phone") {
      setPhoneExists(null)
      value = formatPhone(value.replace(/\D/g, ""))
    } else if (name === "cep") {
      value = formatCEP(value.replace(/\D/g, ""))
    } else if (name === "email") {
      setEmailExists(null)
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

  const handleCpfBlur = async () => {
    const cpf = formData.cpf.replace(/\D/g, "")
    if (cpf.length < 11) return

    if (!validateCPF(cpf)) {
      setCpfExists({ exists: true, user: "CPF inválido" })
      return
    }

    setCheckingCpf(true)
    setCpfExists(null)
    try {
      const response = await fetch(`/api/users/check-cpf?cpf=${encodeURIComponent(formData.cpf)}`)
      const data = await response.json()

      if (data.exists) {
        setCpfExists({ exists: true, user: data.userName })
      } else {
        setCpfExists({ exists: false })
      }
    } catch (error) {
      console.error("[v0] Error checking CPF:", error)
    } finally {
      setCheckingCpf(false)
    }
  }

  const handleEmailBlur = async () => {
    if (!formData.email || !validateEmail(formData.email)) return

    setCheckingEmail(true)
    setEmailExists(null)
    try {
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(formData.email)}`)
      const data = await response.json()

      if (data.exists) {
        setEmailExists({ exists: true, user: data.userName })
      } else {
        setEmailExists({ exists: false })
      }
    } catch (error) {
      console.error("[v0] Error checking email:", error)
    } finally {
      setCheckingEmail(false)
    }
  }

  const handlePhoneBlur = async () => {
    const phone = formData.phone.replace(/\D/g, "")
    if (phone.length < 10) return

    setCheckingPhone(true)
    setPhoneExists(null)
    try {
      const response = await fetch(`/api/users/check-phone?phone=${encodeURIComponent(formData.phone)}`)
      const data = await response.json()

      if (data.exists) {
        setPhoneExists({ exists: true, user: data.userName })
      } else {
        setPhoneExists({ exists: false })
      }
    } catch (error) {
      console.error("[v0] Error checking phone:", error)
    } finally {
      setCheckingPhone(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cpfExists?.exists && cpfExists.user !== "CPF inválido") {
      setMessage({
        type: "error",
        text: `Este CPF já está cadastrado no sistema para ${cpfExists.user || "outro usuário"}`,
      })
      return
    }

    if (cpfExists?.user === "CPF inválido") {
      setMessage({
        type: "error",
        text: "CPF inválido. Por favor, verifique o número digitado.",
      })
      return
    }

    if (emailExists?.exists) {
      setMessage({
        type: "error",
        text: `Este e-mail já está cadastrado no sistema para ${emailExists.user || "outro usuário"}`,
      })
      return
    }

    if (phoneExists?.exists) {
      setMessage({
        type: "error",
        text: `Este telefone já está cadastrado no sistema para ${phoneExists.user || "outro usuário"}`,
      })
      return
    }

    setLoading(true)
    setMessage(null)

    const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`

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
          role: roleToCreate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const roleLabel =
          roleToCreate === "admin" ? "Administrador" : roleToCreate === "operator" ? "Operador" : "Cliente"
        setMessage({
          type: "success",
          text: `${roleLabel} criado com sucesso!`,
        })
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        const roleLabel =
          roleToCreate === "admin" ? "administrador" : roleToCreate === "operator" ? "operador" : "cliente"
        setMessage({
          type: "error",
          text: data.error || `Erro ao criar ${roleLabel}`,
        })
      }
    } catch (error) {
      console.error("[v0] Exception creating user:", error)
      setMessage({ type: "error", text: "Erro ao conectar ao servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <Alert
          className={
            message.type === "error" ? "border-red-500 bg-red-100 border-2" : "border-green-500 bg-green-100 border-2"
          }
        >
          <AlertDescription
            className={message.type === "error" ? "text-red-900 font-semibold" : "text-green-900 font-semibold"}
          >
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
            placeholder="João Silva"
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
            onBlur={handleEmailBlur}
            placeholder="joao@caritas.org.br"
            required
            className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
              emailExists?.exists ? "border-red-500 border-2" : emailExists?.exists === false ? "border-green-500" : ""
            }`}
          />
          {checkingEmail && <p className="text-xs text-white/70 mt-1">Verificando e-mail...</p>}
          {emailExists?.exists && (
            <p className="text-xs text-red-400 mt-1 font-semibold">
              E-mail já cadastrado para: {emailExists.user || "outro usuário"}
            </p>
          )}
          {emailExists?.exists === false && <p className="text-xs text-green-400 mt-1">E-mail disponível</p>}
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
            onBlur={handleCpfBlur}
            placeholder="123.456.789-00"
            required
            maxLength={14}
            className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
              cpfExists?.exists ? "border-red-500 border-2" : cpfExists?.exists === false ? "border-green-500" : ""
            }`}
          />
          {checkingCpf && <p className="text-xs text-white/70 mt-1">Verificando CPF...</p>}
          {cpfExists?.exists && (
            <p className="text-xs text-red-400 mt-1 font-semibold">
              {cpfExists.user === "CPF inválido" ? "CPF inválido" : `CPF já cadastrado para: ${cpfExists.user}`}
            </p>
          )}
          {cpfExists?.exists === false && <p className="text-xs text-green-400 mt-1">CPF válido e disponível</p>}
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
            onBlur={handlePhoneBlur}
            placeholder="(51) 98765-4321"
            maxLength={15}
            className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
              phoneExists?.exists ? "border-red-500 border-2" : phoneExists?.exists === false ? "border-green-500" : ""
            }`}
          />
          {checkingPhone && <p className="text-xs text-white/70 mt-1">Verificando telefone...</p>}
          {phoneExists?.exists && (
            <p className="text-xs text-red-400 mt-1 font-semibold">
              Telefone já cadastrado para: {phoneExists.user || "outro usuário"}
            </p>
          )}
          {phoneExists?.exists === false && <p className="text-xs text-green-400 mt-1">Telefone disponível</p>}
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

      <div>
        <Label htmlFor="password" className="text-white">
          Senha (12+ caracteres, maiúscula, minúscula, número e caractere especial)
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Caritas@2025Admin!"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={
            loading ||
            cpfExists?.exists ||
            emailExists?.exists ||
            phoneExists?.exists ||
            checkingCpf ||
            checkingEmail ||
            checkingPhone
          }
          className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
        >
          {loading
            ? "Criando..."
            : `Criar ${roleToCreate === "admin" ? "Administrador" : roleToCreate === "operator" ? "Operador" : "Cliente"}`}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
