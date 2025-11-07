import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("id")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    // Get purchase history
    const { data: receipts, error: receiptsError } = await supabase
      .from("receipts")
      .select(`
        *,
        items:receipt_items(*)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (receiptsError) throw receiptsError

    // Get scheduled appointments
    const { data: schedules, error: schedulesError } = await supabase
      .from("schedules")
      .select("*")
      .eq("user_id", customerId)
      .order("schedule_date", { ascending: false })

    if (schedulesError) throw schedulesError

    return NextResponse.json({
      receipts,
      schedules,
    })
  } catch (error) {
    console.error("Error fetching customer history:", error)
    return NextResponse.json({ error: "Failed to fetch customer history" }, { status: 500 })
  }
}
