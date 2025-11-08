import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

const BRAZILIAN_HOLIDAYS_2025 = [
  "2025-01-01",
  "2025-02-24",
  "2025-02-25",
  "2025-04-18",
  "2025-04-21",
  "2025-05-01",
  "2025-06-19",
  "2025-09-07",
  "2025-10-12",
  "2025-11-02",
  "2025-11-15",
  "2025-12-25",
]

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    const dateObj = new Date(date + "T00:00:00")
    const dayOfWeek = dateObj.getDay()

    if (dayOfWeek === 0 || dayOfWeek === 6 || BRAZILIAN_HOLIDAYS_2025.includes(date)) {
      return NextResponse.json([]) // No slots available on weekends/holidays
    }

    const { data: schedules, error } = await supabase
      .from("schedules")
      .select("schedule_time")
      .eq("schedule_date", date)
      .eq("status", "confirmed")

    if (error) throw error

    const businessHours = {
      morningStart: 8,
      morningEnd: 12,
      afternoonStart: 13,
      afternoonEnd: 18,
      maxCapacity: 1, // Changed from 2 to 1 person per slot
    }

    const bookedTimes = schedules.map((s) => s.schedule_time)
    const availableSlots = []

    for (let hour = businessHours.morningStart; hour <= businessHours.morningEnd; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00:00`
      const bookingsForSlot = bookedTimes.filter((t) => t === timeStr).length

      if (bookingsForSlot < businessHours.maxCapacity) {
        availableSlots.push({
          time: timeStr,
          capacity: businessHours.maxCapacity - bookingsForSlot,
          display: `${String(hour).padStart(2, "0")}:00`,
        })
      }
    }

    for (let hour = businessHours.afternoonStart; hour <= businessHours.afternoonEnd; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00:00`
      const bookingsForSlot = bookedTimes.filter((t) => t === timeStr).length

      if (bookingsForSlot < businessHours.maxCapacity) {
        availableSlots.push({
          time: timeStr,
          capacity: businessHours.maxCapacity - bookingsForSlot,
          display: `${String(hour).padStart(2, "0")}:00`,
        })
      }
    }

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 500 })
  }
}
