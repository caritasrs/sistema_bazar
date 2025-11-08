"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedCalendar } from "@/components/scheduling/enhanced-calendar"
import { PublicTimeSlots } from "@/components/scheduling/public-time-slots"
import { formatCPF } from "@/lib/format-utils"
import { CheckCircle, ArrowLeft, CalendarIcon, UserPlus, LogIn } from "lucide-react"
import Link from "next/link"

export default function SchedulingPage() {
  const [step, setStep] = useState<"calendar" | "time" | "auth" | "register" | "login" | "confirm">("calendar")
  const [customerData, setCustomerData] = useState({
    email: "",
    cpf: "",
    name: "",
    phone: "",
    password: "",
  })
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCustomerDataChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value.replace(/\D/g, ""))
    }
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep("time")
    setSelectedTime("")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep("auth")
  }

  const handleChooseRegister = () => {
    setStep("register")
  }

  const handleChooseLogin = () => {
    setStep("login")
  }

  const handleRegister = async () => {
    if (!customerData.name || !customerData.email || !customerData.cpf || !customerData.password) {
      setMessage({ type: "error", text: "Preencha todos os campos" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/crm/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customerData,
          registration_source: "self_registered",
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Cadastro realizado com sucesso!" })
        setTimeout(() => setStep("confirm"), 1000)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar cadastro")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao realizar cadastro",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!customerData.cpf || !customerData.password) {
      setMessage({ type: "error", text: "Preencha CPF e senha" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/crm/get-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: customerData.cpf }),
      })

      if (response.ok) {
        const customer = await response.json()
        setCustomerData((prev) => ({ ...prev, name: customer.name, email: customer.email, phone: customer.phone }))
        setMessage({ type: "success", text: "Login realizado com sucesso!" })
        setTimeout(() => setStep("confirm"), 1000)
      } else {
        throw new Error("CPF não encontrado")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao realizar login",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      let customerId = null

      const getResponse = await fetch("/api/crm/get-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: customerData.cpf }),
      })

      if (getResponse.ok) {
        const customer = await getResponse.json()
        customerId = customer.id
      }

      if (!customerId) {
        throw new Error("Erro ao identificar cliente")
      }

      const response = await fetch("/api/scheduling/create-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: customerId,
          schedule_date: selectedDate,
          schedule_time: selectedTime,
          duration_minutes: 60,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setMessage({
        type: "success",
        text: "Agendamento realizado com sucesso! Você receberá uma confirmação por e-mail.",
      })

      setTimeout(() => {
        setStep("calendar")
        setCustomerData({ email: "", cpf: "", name: "", phone: "", password: "" })
        setSelectedDate("")
        setSelectedTime("")
      }, 3000)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao realizar agendamento",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <Link
            href="/dashboard/agendamentos"
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors text-sm"
          >
            <CalendarIcon className="w-4 h-4" />
            Área Administrativa
          </Link>
        </div>

        <div className="bg-red-900/25 backdrop-blur-md border border-red-300/20 rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-white w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 bg-red-600" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Agende sua Visita</h1>
          <p className="text-white/90 text-lg">Bazar Solidário Cáritas RS</p>
        </div>

        {message && (
          <Alert
            className={
              message.type === "error"
                ? "border-red-400 bg-red-900/30 backdrop-blur-sm"
                : "border-green-400 bg-green-900/30 backdrop-blur-sm"
            }
          >
            <AlertDescription
              className={
                message.type === "error"
                  ? "text-red-100 font-medium"
                  : "text-green-100 font-medium flex items-center gap-2"
              }
            >
              {message.type === "success" && <CheckCircle className="w-5 h-5" />}
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {step === "calendar" && (
          <div className="space-y-4">
            <EnhancedCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} showAvailabilityOnly={true} />
          </div>
        )}

        {step === "time" && (
          <div className="space-y-4">
            <PublicTimeSlots date={selectedDate} onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
            <Button
              variant="outline"
              onClick={() => setStep("calendar")}
              className="w-full bg-red-900/25 backdrop-blur-md hover:bg-red-900/40 border border-red-300/20 text-white h-12 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )}

        {step === "auth" && (
          <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-xl border-b border-red-300/20">
              <CardTitle className="text-2xl text-center">Como deseja continuar?</CardTitle>
              <CardDescription className="text-white/90 text-center">
                Para confirmar seu agendamento, faça login ou cadastre-se
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button
                onClick={handleChooseRegister}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg h-14 font-semibold shadow-lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Cadastro
              </Button>

              <Button
                onClick={handleChooseLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg h-14 font-semibold shadow-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Já tenho Cadastro
              </Button>

              <Button
                variant="outline"
                onClick={() => setStep("time")}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 h-12 font-semibold mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "register" && (
          <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl border-b border-green-300/20">
              <CardTitle className="text-2xl">Criar Cadastro</CardTitle>
              <CardDescription className="text-white/90">Preencha seus dados para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label className="text-white font-semibold">Nome Completo</Label>
                <Input
                  placeholder="João da Silva"
                  value={customerData.name}
                  onChange={(e) => handleCustomerDataChange("name", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div>
                <Label className="text-white font-semibold">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={customerData.email}
                  onChange={(e) => handleCustomerDataChange("email", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div>
                <Label className="text-white font-semibold">CPF</Label>
                <Input
                  placeholder="123.456.789-00"
                  value={customerData.cpf}
                  onChange={(e) => handleCustomerDataChange("cpf", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Telefone</Label>
                <Input
                  placeholder="(51) 99999-9999"
                  value={customerData.phone}
                  onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Senha</Label>
                <Input
                  type="password"
                  placeholder="Crie uma senha"
                  value={customerData.password}
                  onChange={(e) => handleCustomerDataChange("password", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("auth")}
                  className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 h-12 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 font-semibold shadow-lg"
                >
                  {loading ? "Cadastrando..." : "Criar Cadastro"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "login" && (
          <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl border-b border-blue-300/20">
              <CardTitle className="text-2xl">Fazer Login</CardTitle>
              <CardDescription className="text-white/90">Entre com seus dados de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label className="text-white font-semibold">CPF</Label>
                <Input
                  placeholder="123.456.789-00"
                  value={customerData.cpf}
                  onChange={(e) => handleCustomerDataChange("cpf", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Senha</Label>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={customerData.password}
                  onChange={(e) => handleCustomerDataChange("password", e.target.value)}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("auth")}
                  className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 h-12 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 font-semibold shadow-lg"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "confirm" && (
          <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl border-b border-green-300/20">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Confirme seu Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-white/70">Nome:</span>
                  <span className="text-white">{customerData.name}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-white/70">E-mail:</span>
                  <span className="text-white">{customerData.email}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-white/70">CPF:</span>
                  <span className="text-white">{customerData.cpf}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-white/70">Data:</span>
                  <span className="text-white font-semibold">
                    {new Date(selectedDate).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-white/70">Horário:</span>
                  <span className="text-white font-semibold">{selectedTime}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("time")}
                  className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 h-12 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Alterar Horário
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 font-semibold shadow-lg"
                >
                  {loading ? "Processando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
