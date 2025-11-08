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
      return NextResponse.json([])
    }

    const { data: schedules, error } = await supabase
      .from("schedules")
      .select("schedule_time")
      .eq("schedule_date", date)
      .eq("status", "confirmed")

    if (error) throw error

    const bookedTimes = new Set(schedules.map((s) => s.schedule_time))
    const allSlots = []

    // Morning slots
    for (let hour = 8; hour <= 12; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00:00`
      const isBooked = bookedTimes.has(timeStr)

      allSlots.push({
        time: timeStr,
        display: `${String(hour).padStart(2, "0")}:00`,
        available: !isBooked,
      })
    }

    // Afternoon slots
    for (let hour = 13; hour <= 18; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00:00`
      const isBooked = bookedTimes.has(timeStr)

      allSlots.push({
        time: timeStr,
        display: `${String(hour).padStart(2, "0")}:00`,
        available: !isBooked,
      })
    }

    return NextResponse.json(allSlots)
  } catch (error) {
    console.error("Error fetching all slots:", error)
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}
