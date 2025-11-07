"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format-utils"

export default function AdminSchedulingPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSchedules()
  }, [selectedDate])

  const loadSchedules = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/scheduling/list?date=${selectedDate}`)
      const data = await response.json()
      setSchedules(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading schedules:", error)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (scheduleId: string) => {
    if (!confirm("Deseja cancelar este agendamento?")) return

    try {
      const response = await fetch("/api/scheduling/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_id: scheduleId }),
      })

      if (response.ok) {
        loadSchedules()
      }
    } catch (error) {
      alert("Erro ao cancelar agendamento")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Agenda de Agendamentos</h1>
        <p className="text-gray-600">Controle de fluxo e presença</p>
      </div>

      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Filtrar por Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <Button onClick={loadSchedules} className="bg-red-600 hover:bg-red-700">
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-red-200">
        <CardHeader>
          <CardTitle>Agendamentos do Dia</CardTitle>
          <CardDescription>
            {formatDate(selectedDate)} - {schedules.length} agendamento(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum agendamento para esta data</div>
          ) : (
            <div className="space-y-2">
              {schedules.map((schedule) => (
                <Card key={schedule.id} className="bg-red-50 border-red-100 p-4">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="font-semibold text-red-700">{schedule.schedule_time}</div>
                      <div className="text-xs text-gray-600">{schedule.user?.name}</div>
                    </div>
                    <div>
                      <div className="text-sm">CPF: {schedule.user?.cpf}</div>
                      <div className="text-xs text-gray-600">{schedule.user?.phone}</div>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          schedule.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {schedule.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{schedule.notes && `Observação: ${schedule.notes}`}</div>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(schedule.id)}
                        className="text-red-600"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
