import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { user_id, schedule_date, schedule_time, notes } = body

    if (!user_id || !schedule_date || !schedule_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: existingSchedules, error: checkError } = await supabase
      .from("schedules")
      .select("id")
      .eq("schedule_date", schedule_date)
      .eq("schedule_time", schedule_time)
      .eq("status", "confirmed")

    if (checkError) {
      console.error("[v0] Error checking slot capacity:", checkError)
      throw checkError
    }

    console.log("[v0] Existing schedules for this slot:", existingSchedules?.length || 0)

    if (existingSchedules && existingSchedules.length >= 1) {
      return NextResponse.json(
        {
          error: "Este horário já está ocupado",
        },
        { status: 409 },
      )
    }

    const { data: schedule, error } = await supabase
      .from("schedules")
      .insert([
        {
          user_id,
          schedule_date,
          schedule_time,
          duration_minutes: 60,
          status: "confirmed",
          notes,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error inserting schedule:", error)
      throw error
    }

    console.log("[v0] Schedule created successfully:", schedule.id)

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
  } catch (error: any) {
    console.error("[v0] Error creating schedule:", error.message)
    return NextResponse.json(
      {
        error: error.message || "Failed to create schedule",
      },
      { status: 500 },
    )
  }
}
