import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = supabase.from("receipts").select("payment_method, total_amount")

    if (startDate && endDate) {
      query = query.gte("created_at", `${startDate}T00:00:00`).lte("created_at", `${endDate}T23:59:59`)
    }

    const { data: receipts, error } = await query

    if (error) {
      console.error("Error fetching receipts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const byMethod = {
      pix: 0,
      cash: 0,
    }

    receipts?.forEach((r: any) => {
      if (r.payment_method === "pix") {
        byMethod.pix += r.total_amount || 0
      } else if (r.payment_method === "cash") {
        byMethod.cash += r.total_amount || 0
      }
    })

    return NextResponse.json(byMethod)
  } catch (error) {
    console.error("Error fetching sales by method:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
