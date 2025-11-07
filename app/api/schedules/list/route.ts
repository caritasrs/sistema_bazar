import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    const supabase = createClient()

    let query = supabase
      .from("schedules")
      .select(`
        *,
        user:users(name, email, phone)
      `)
      .order("schedule_date", { ascending: true })
      .order("schedule_time", { ascending: true })

    if (date) {
      query = query.eq("schedule_date", date)
    }

    const { data: schedules, error } = await query

    if (error) {
      console.error("[v0] Error fetching schedules:", error)
      throw error
    }

    return NextResponse.json({ schedules })
  } catch (error) {
    console.error("[v0] Error in schedules list:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}
