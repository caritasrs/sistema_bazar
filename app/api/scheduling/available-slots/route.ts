import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    // Get all schedules for the date
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
      slotDuration: 60, // 1 hour in minutes
      maxCapacity: 2, // 2 people per slot
    }

    const bookedTimes = schedules.map((s) => s.schedule_time)
    const availableSlots = []

    // Morning slots: 8h, 9h, 10h, 11h, 12h
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

    // Afternoon slots: 13h, 14h, 15h, 16h, 17h, 18h
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
