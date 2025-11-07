"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"

interface TimeSlot {
  time: string
  capacity: number
  display?: string // Added display field for formatted time
}

interface EnhancedTimeSlotsProps {
  date: string
  onTimeSelect: (time: string) => void
  selectedTime?: string
}

export function EnhancedTimeSlots({ date, onTimeSelect, selectedTime }: EnhancedTimeSlotsProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/scheduling/available-slots?date=${date}`)
        const data = await response.json()
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
      <Card className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-2 border-orange-200 shadow-xl">
        <CardContent className="py-12">
          <div className="text-center text-gray-600">
            <Clock className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-600" />
            Carregando horários disponíveis...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-2 border-orange-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          <CardTitle className="text-2xl">Horários Disponíveis</CardTitle>
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
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium">Nenhum horário disponível para esta data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time
                const capacityPercent = (slot.capacity / 2) * 100 // Assuming max capacity is 2
                const displayTime = slot.display || slot.time.substring(0, 5) // Format time to show only HH:MM without seconds

                return (
                  <Button
                    key={slot.time}
                    onClick={() => onTimeSelect(slot.time)}
                    className={`
                      relative h-auto py-4 flex flex-col gap-1 font-semibold
                      transition-all duration-200 transform hover:scale-105
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-lg scale-105"
                          : capacityPercent === 100
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600"
                            : "bg-gradient-to-br from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600"
                      }
                    `}
                  >
                    <div className="flex items-center gap-1 text-lg">
                      <Clock className="w-4 h-4" />
                      {displayTime}
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <Users className="w-3 h-3" />
                      {slot.capacity} {slot.capacity === 1 ? "vaga" : "vagas"}
                    </div>
                  </Button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded shadow"></div>
                <span className="font-medium text-green-900">2 vagas</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded shadow"></div>
                <span className="font-medium text-yellow-900">1 vaga</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
