"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Phone, Mail } from "lucide-react"

interface Schedule {
  id: string
  schedule_date: string
  schedule_time: string
  status: string
  user: {
    name: string
    email: string
    phone: string
  }
}

export function AdminScheduleView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSchedules()
  }, [selectedDate])

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/schedules/list?date=${dateStr}`)
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const allTimeSlots: string[] = []
  for (let hour = 8; hour < 17; hour++) {
    allTimeSlots.push(`${String(hour).padStart(2, "0")}:00:00`)
    allTimeSlots.push(`${String(hour).padStart(2, "0")}:30:00`)
  }

  const getSchedulesForSlot = (time: string) => {
    return schedules.filter((s) => s.schedule_time === time)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            <CardTitle className="text-2xl">Agenda Completa - Visão Administrativa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Dia Anterior
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div className="text-sm text-blue-600">
                {schedules.length} {schedules.length === 1 ? "agendamento" : "agendamentos"}
              </div>
            </div>
            <Button
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Próximo Dia
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTimeSlots.map((timeSlot) => {
          const schedulesInSlot = getSchedulesForSlot(timeSlot)
          const capacity = 2
          const available = capacity - schedulesInSlot.length
          const timeDisplay = timeSlot.substring(0, 5)

          return (
            <Card
              key={timeSlot}
              className={`border-2 transition-all ${
                available === 0
                  ? "bg-red-50 border-red-300"
                  : available === 1
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-green-50 border-green-300"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <CardTitle className="text-lg">{timeDisplay}</CardTitle>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      available === 0
                        ? "bg-red-200 text-red-800"
                        : available === 1
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                    }`}
                  >
                    {available} {available === 1 ? "vaga" : "vagas"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {schedulesInSlot.length === 0 ? (
                  <div className="text-center text-gray-500 py-4 italic">Nenhum agendamento</div>
                ) : (
                  schedulesInSlot.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 mt-0.5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{schedule.user.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{schedule.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{schedule.user.phone || "Não informado"}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                        Status: <span className="font-semibold">{schedule.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
