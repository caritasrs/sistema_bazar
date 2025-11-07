import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { user_id, schedule_date, schedule_time, duration_minutes, notes } = body

    if (!user_id || !schedule_date || !schedule_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slot is still available
    const { data: existingSchedules, error: checkError } = await supabase
      .from("schedules")
      .select("id")
      .eq("schedule_date", schedule_date)
      .eq("schedule_time", schedule_time)
      .eq("status", "confirmed")

    if (checkError) throw checkError

    if (existingSchedules && existingSchedules.length >= 2) {
      return NextResponse.json({ error: "This time slot is full" }, { status: 409 })
    }

    // Create schedule
    const { data: schedule, error } = await supabase
      .from("schedules")
      .insert([
        {
          user_id,
          schedule_date,
          schedule_time,
          duration_minutes: duration_minutes || 30,
          status: "confirmed",
          notes,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id,
        action: "schedule_created",
        table_name: "schedules",
        record_id: schedule.id,
      },
    ])

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}
