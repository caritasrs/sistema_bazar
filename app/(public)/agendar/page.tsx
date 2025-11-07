"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedCalendar } from "@/components/scheduling/enhanced-calendar"
import { EnhancedTimeSlots } from "@/components/scheduling/enhanced-time-slots"
import { formatCPF } from "@/lib/format-utils"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function SchedulingPage() {
  const [step, setStep] = useState<"info" | "date" | "time" | "confirm">("info")
  const [customerData, setCustomerData] = useState({
    email: "",
    cpf: "",
    name: "",
    phone: "",
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

  const handleContinueInfo = () => {
    if (!customerData.name || !customerData.email || !customerData.cpf) {
      setMessage({ type: "error", text: "Preencha todos os campos" })
      return
    }
    setStep("date")
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep("time")
    setSelectedTime("")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep("confirm")
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      let customerId = null
      try {
        const getResponse = await fetch("/api/crm/get-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cpf: customerData.cpf }),
        })

        if (getResponse.ok) {
          const customer = await getResponse.json()
          customerId = customer.id
        } else {
          const createResponse = await fetch("/api/crm/create-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...customerData,
              registration_source: "self_registered",
            }),
          })

          if (createResponse.ok) {
            const customer = await createResponse.json()
            customerId = customer.id
          } else if (createResponse.status === 409) {
            const existingCustomer = await createResponse.json()
            customerId = existingCustomer.customer?.id
          }
        }
      } catch (error) {
        console.error("Error with customer:", error)
      }

      const response = await fetch("/api/scheduling/create-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: customerId,
          schedule_date: selectedDate,
          schedule_time: selectedTime,
          duration_minutes: 30,
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
        setStep("info")
        setCustomerData({ email: "", cpf: "", name: "", phone: "" })
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
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-red-700 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="bg-white w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 bg-red-600" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Agende sua Visita</h1>
          <p className="text-white/90 text-lg">Bazar Solidário Cáritas RS</p>
        </div>

        {message && (
          <Alert className={message.type === "error" ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
            <AlertDescription
              className={
                message.type === "error"
                  ? "text-red-900 font-medium"
                  : "text-green-900 font-medium flex items-center gap-2"
              }
            >
              {message.type === "success" && <CheckCircle className="w-5 h-5" />}
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {step === "info" && (
          <Card className="bg-white/95 border-2 border-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Seus Dados</CardTitle>
              <CardDescription className="text-white/90">Informações para agendamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label className="text-gray-700 font-semibold">Nome Completo</Label>
                <Input
                  placeholder="João da Silva"
                  value={customerData.name}
                  onChange={(e) => handleCustomerDataChange("name", e.target.value)}
                  className="border-2 border-gray-300 focus:border-red-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-semibold">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={customerData.email}
                  onChange={(e) => handleCustomerDataChange("email", e.target.value)}
                  className="border-2 border-gray-300 focus:border-red-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-semibold">CPF</Label>
                <Input
                  placeholder="123.456.789-00"
                  value={customerData.cpf}
                  onChange={(e) => handleCustomerDataChange("cpf", e.target.value)}
                  className="border-2 border-gray-300 focus:border-red-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-semibold">Telefone</Label>
                <Input
                  placeholder="(51) 99999-9999"
                  value={customerData.phone}
                  onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
                  className="border-2 border-gray-300 focus:border-red-500"
                />
              </div>

              <Button
                onClick={handleContinueInfo}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg h-12 font-semibold shadow-lg"
              >
                Continuar para Agendamento
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "date" && (
          <div className="space-y-4">
            <EnhancedCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} showAvailabilityOnly={true} />
            <Button
              variant="outline"
              onClick={() => setStep("info")}
              className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 h-12 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-4">
            <EnhancedTimeSlots date={selectedDate} onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
            <Button
              variant="outline"
              onClick={() => setStep("date")}
              className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 h-12 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <Card className="bg-white/95 border-2 border-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Confirme seu Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border-2 border-gray-200">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-gray-700">Nome:</span>
                  <span className="text-gray-900">{customerData.name}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-gray-700">E-mail:</span>
                  <span className="text-gray-900">{customerData.email}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-gray-700">CPF:</span>
                  <span className="text-gray-900">{customerData.cpf}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-gray-700">Data:</span>
                  <span className="text-gray-900 font-semibold">
                    {new Date(selectedDate).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-bold text-gray-700">Horário:</span>
                  <span className="text-gray-900 font-semibold">{selectedTime}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("time")}
                  className="flex-1 border-2 border-gray-300 h-12 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
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
