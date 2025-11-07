"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarPicker } from "@/components/scheduling/calendar-picker"
import { TimeSlots } from "@/components/scheduling/time-slots"
import { formatCPF } from "@/lib/format-utils"

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
      // First, create or get customer
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
          // Create new customer
          const createResponse = await fetch("/api/crm/create-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          })

          if (createResponse.ok) {
            const customer = await createResponse.json()
            customerId = customer.id
          }
        }
      } catch (error) {
        console.error("Error with customer:", error)
      }

      // Create schedule
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

      // Reset form
      setTimeout(() => {
        setStep("info")
        setCustomerData({ email: "", cpf: "", name: "", phone: "" })
        setSelectedDate("")
        setSelectedTime("")
      }, 2000)
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Agende sua Visita</h1>
          <p className="text-gray-600">Bazar Solidário Cáritas RS</p>
        </div>

        {message && (
          <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {step === "info" && (
          <Card className="bg-white/95 border-red-200">
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
              <CardDescription>Informações para agendamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  placeholder="João da Silva"
                  value={customerData.name}
                  onChange={(e) => handleCustomerDataChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={customerData.email}
                  onChange={(e) => handleCustomerDataChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label>CPF</Label>
                <Input
                  placeholder="123.456.789-00"
                  value={customerData.cpf}
                  onChange={(e) => handleCustomerDataChange("cpf", e.target.value)}
                />
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  placeholder="(51) 99999-9999"
                  value={customerData.phone}
                  onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
                />
              </div>

              <Button onClick={handleContinueInfo} className="w-full bg-red-600 hover:bg-red-700">
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "date" && (
          <div className="space-y-4">
            <CalendarPicker onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            <Button variant="outline" onClick={() => setStep("info")} className="w-full">
              Voltar
            </Button>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-4">
            <TimeSlots date={selectedDate} onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
            <Button variant="outline" onClick={() => setStep("date")} className="w-full">
              Voltar
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <Card className="bg-white/95 border-red-200">
            <CardHeader>
              <CardTitle>Confirme seu Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 bg-red-50 p-4 rounded-lg">
                <div>
                  <span className="font-semibold">Nome:</span>
                  <div className="text-gray-700">{customerData.name}</div>
                </div>
                <div>
                  <span className="font-semibold">E-mail:</span>
                  <div className="text-gray-700">{customerData.email}</div>
                </div>
                <div>
                  <span className="font-semibold">CPF:</span>
                  <div className="text-gray-700">{customerData.cpf}</div>
                </div>
                <div>
                  <span className="font-semibold">Data:</span>
                  <div className="text-gray-700">{selectedDate}</div>
                </div>
                <div>
                  <span className="font-semibold">Horário:</span>
                  <div className="text-gray-700">{selectedTime}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("time")} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700">
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
