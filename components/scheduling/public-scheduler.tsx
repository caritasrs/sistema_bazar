"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock } from "lucide-react"

export function PublicScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [schedules, setSchedules] = useState([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  useEffect(() => {
    if (date) {
      fetchSchedules(date)
    }
  }, [date])

  const fetchSchedules = async (selectedDate: Date) => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/schedules/list?date=${dateStr}`)
      const data = await response.json()
      setSchedules(data.schedules || [])

      // Generate time slots from 9:00 to 17:00
      const slots = []
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`)
        if (hour < 17) {
          slots.push(`${hour.toString().padStart(2, "0")}:30`)
        }
      }
      setTimeSlots(slots)
    } catch (error) {
      console.error("[v0] Error fetching schedules:", error)
    }
  }

  const isSlotBooked = (time: string) => {
    return schedules.some((s: any) => s.schedule_time === time + ":00")
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
        <CardHeader>
          <CardTitle className="text-white">Selecione a Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-white/90 rounded-lg"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </CardContent>
      </Card>

      <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
        <CardHeader>
          <CardTitle className="text-white">Horários Disponíveis</CardTitle>
          <p className="text-white/70 text-sm">
            {date?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {timeSlots.map((time) => {
              const booked = isSlotBooked(time)
              return (
                <Button
                  key={time}
                  variant={booked ? "outline" : "default"}
                  disabled={booked}
                  className={
                    booked
                      ? "bg-gray-600 text-white border-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </Button>
              )
            })}
          </div>

          <div className="mt-6 flex gap-4 text-sm text-white">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>Ocupado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
