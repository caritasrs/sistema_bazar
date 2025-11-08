"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, XCircle, CheckCircle } from "lucide-react"

interface TimeSlot {
  time: string
  display: string
  available: boolean
}

interface PublicTimeSlotsProps {
  date: string
  onTimeSelect: (time: string) => void
  selectedTime?: string
}

export function PublicTimeSlots({ date, onTimeSelect, selectedTime }: PublicTimeSlotsProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        console.log("[v0] Fetching all slots for date:", date)

        const response = await fetch(`/api/scheduling/all-slots?date=${date}`)
        const data = await response.json()

        const availableCount = data.filter((s: TimeSlot) => s.available).length
        const occupiedCount = data.filter((s: TimeSlot) => !s.available).length
        console.log("[v0] Slots loaded - Available:", availableCount, "Occupied:", occupiedCount, "Total:", data.length)

        setSlots(data)
      } catch (error) {
        console.error("Error fetching slots:", error)
      } finally {
        setLoading(false)
      }
    }

    if (date) {
      fetchSlots()
    }
  }, [date])

  if (loading) {
    return (
      <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-xl">
        <CardContent className="py-12">
          <div className="text-center text-white">
            <Clock className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-400" />
            Carregando horários...
          </div>
        </CardContent>
      </Card>
    )
  }

  const availableSlots = slots.filter((s) => s.available)

  return (
    <Card className="bg-red-900/25 backdrop-blur-md border border-red-300/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-xl border-b border-red-300/20">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          <CardTitle className="text-2xl">Horários de Atendimento</CardTitle>
        </div>
        <CardDescription className="text-white/90 text-center">
          {new Date(date).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {slots.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <p className="text-white/70 font-medium">Nenhum horário disponível para esta data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time
                const isAvailable = slot.available

                return (
                  <Button
                    key={slot.time}
                    onClick={() => isAvailable && onTimeSelect(slot.time)}
                    disabled={!isAvailable}
                    className={`
                      relative h-auto py-4 flex flex-col gap-1 font-semibold
                      transition-all duration-200 transform
                      ${
                        !isAvailable
                          ? "bg-gradient-to-br from-red-500 to-red-700 text-white cursor-not-allowed opacity-90"
                          : isSelected
                            ? "bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg scale-105"
                            : "bg-gradient-to-br from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 hover:scale-105"
                      }
                    `}
                  >
                    <div className="flex items-center gap-1 text-lg">
                      <Clock className="w-4 h-4" />
                      {slot.display}
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      {isAvailable ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Disponível
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Ocupado
                        </>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>

            <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4 mb-4">
              <p className="text-white font-semibold text-center">
                {availableSlots.length} {availableSlots.length === 1 ? "horário disponível" : "horários disponíveis"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 bg-green-900/30 backdrop-blur-sm border border-green-400/30 p-3 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded shadow"></div>
                <span className="font-medium text-white">Disponível</span>
              </div>
              <div className="flex items-center gap-2 bg-red-900/30 backdrop-blur-sm border border-red-400/30 p-3 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded shadow"></div>
                <span className="font-medium text-white">Ocupado</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
