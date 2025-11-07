"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarPickerProps {
  onDateSelect: (date: string) => void
  selectedDate?: string
}

export function CalendarPicker({ onDateSelect, selectedDate }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleString("pt-BR", { month: "long", year: "numeric" })

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle className="text-center">Selecione uma Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center font-semibold capitalize">{monthName}</div>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                if (day) {
                  const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  onDateSelect(dateStr)
                }
              }}
              disabled={!day}
              className={`p-2 text-sm rounded aspect-square ${
                !day
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : selectedDate === formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    ? "bg-red-600 text-white font-semibold"
                    : "bg-gray-100 hover:bg-red-200 text-gray-800"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
