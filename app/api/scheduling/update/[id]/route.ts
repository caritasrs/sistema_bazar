import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()
    const { schedule_time, notes } = body

    const { data: schedule } = await supabase.from("schedules").select("schedule_date, user_id").eq("id", id).single()

    if (schedule_time) {
      const { data: existingSchedules } = await supabase
        .from("schedules")
        .select("id")
        .eq("schedule_date", schedule.schedule_date)
        .eq("schedule_time", schedule_time)
        .eq("status", "confirmed")
        .neq("id", id)

      if (existingSchedules && existingSchedules.length >= 2) {
        return NextResponse.json({ error: "This time slot is full" }, { status: 409 })
      }
    }

    const updateData: any = {}
    if (schedule_time) updateData.schedule_time = schedule_time
    if (notes !== undefined) updateData.notes = notes

    const { error } = await supabase.from("schedules").update(updateData).eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating schedule:", error)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}
