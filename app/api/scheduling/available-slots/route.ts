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

    // Define business hours (08:00 to 17:00, 30-minute slots)
    const businessHours = {
      start: 8,
      end: 17,
      slotDuration: 30, // minutes
      maxCapacity: 2, // 2 people per slot
    }

    const bookedTimes = schedules.map((s) => s.schedule_time)
    const availableSlots = []

    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += businessHours.slotDuration) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        const bookingsForSlot = bookedTimes.filter((t) => t === timeStr).length

        if (bookingsForSlot < businessHours.maxCapacity) {
          availableSlots.push({
            time: timeStr,
            capacity: businessHours.maxCapacity - bookingsForSlot,
          })
        }
      }
    }

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 500 })
  }
}
