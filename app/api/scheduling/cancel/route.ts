import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { schedule_id } = body

    if (!schedule_id) {
      return NextResponse.json({ error: "Schedule ID required" }, { status: 400 })
    }

    const { data: schedule, error } = await supabase
      .from("schedules")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", schedule_id)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: schedule.user_id,
        action: "schedule_cancelled",
        table_name: "schedules",
        record_id: schedule_id,
      },
    ])

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Error cancelling schedule:", error)
    return NextResponse.json({ error: "Failed to cancel schedule" }, { status: 500 })
  }
}
