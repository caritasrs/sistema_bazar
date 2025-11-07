"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeSlot {
  time: string
  capacity: number
}

interface TimeSlotsProps {
  date: string
  onTimeSelect: (time: string) => void
  selectedTime?: string
}

export function TimeSlots({ date, onTimeSelect, selectedTime }: TimeSlotsProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/scheduling/available-slots?date=${date}`)
        const data = await response.json()
        setSlots(data)
      } finally {
        setLoading(false)
      }
    }

    if (date) {
      fetchSlots()
    }
  }, [date])

  if (loading) {
    return <div className="text-center py-4">Carregando horários disponíveis...</div>
  }

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>Horários Disponíveis</CardTitle>
        <CardDescription>Escolha um horário para seu agendamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {slots.length === 0 ? (
            <div className="col-span-4 text-center py-4 text-gray-500">Nenhum horário disponível para esta data</div>
          ) : (
            slots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                onClick={() => onTimeSelect(slot.time)}
                className={`${selectedTime === slot.time ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                {slot.time}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
