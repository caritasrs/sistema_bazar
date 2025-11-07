"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface EnhancedCalendarProps {
  onDateSelect: (date: string) => void
  selectedDate?: string
  showAvailabilityOnly?: boolean
}

export function EnhancedCalendar({ onDateSelect, selectedDate, showAvailabilityOnly = true }: EnhancedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showAvailabilityOnly) {
      fetchAvailableDates()
    }
  }, [currentMonth, showAvailabilityOnly])

  const fetchAvailableDates = async () => {
    setLoading(true)
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const available = new Set<string>()

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const dayDate = new Date(year, month, day)

        // Skip past dates
        if (dayDate < new Date(new Date().setHours(0, 0, 0, 0))) {
          continue
        }

        // Check if date has available slots
        const response = await fetch(`/api/scheduling/available-slots?date=${dateStr}`)
        const slots = await response.json()

        if (slots.length > 0) {
          available.add(dateStr)
        }
      }

      setAvailableDates(available)
    } catch (error) {
      console.error("Error fetching available dates:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const isPastDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  const isAvailable = (day: number) => {
    const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return availableDates.has(dateStr)
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 via-white to-orange-50 border-2 border-red-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          <CardTitle className="text-2xl">Selecione uma Data</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="border-red-300 hover:bg-red-50 hover:border-red-500 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5 text-red-600" />
          </Button>
          <div className="text-center font-bold text-lg capitalize text-red-900">{monthName}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="border-red-300 hover:bg-red-50 hover:border-red-500 bg-transparent"
          >
            <ChevronRight className="w-5 h-5 text-red-600" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, idx) => (
            <div
              key={day}
              className={`text-center text-sm font-bold ${idx === 0 || idx === 6 ? "text-red-600" : "text-orange-600"}`}
            >
              {day}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Carregando datas disponíveis...</div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} />
                }

                const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                const isPast = isPastDate(day)
                const hasSlots = isAvailable(day)
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isPast && (!showAvailabilityOnly || hasSlots)) {
                        onDateSelect(dateStr)
                      }
                    }}
                    disabled={isPast || (showAvailabilityOnly && !hasSlots)}
                    className={`
                      relative p-3 text-sm rounded-xl font-semibold aspect-square
                      transition-all duration-200 transform hover:scale-105
                      ${
                        isPast
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : showAvailabilityOnly && !hasSlots
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                            : isSelected
                              ? "bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-lg scale-105"
                              : hasSlots
                                ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-md"
                                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400"
                      }
                    `}
                  >
                    <span className="block">{day}</span>
                    {hasSlots && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow"></div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded shadow"></div>
                <span className="font-medium text-green-900">Disponível</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="font-medium text-gray-700">Sem vagas</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
