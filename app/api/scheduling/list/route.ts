import { createClient as createAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const date = searchParams.get("date")

    let query = supabase
      .from("schedules")
      .select(`
        *,
        user:users(name, cpf, phone)
      `)
      .order("schedule_date", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (date) {
      query = query.eq("schedule_date", date)
    }

    const { data: schedules, error } = await query

    if (error) throw error

    return NextResponse.json(schedules || [])
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json([], { status: 200 })
  }
}
