import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query = supabase.from("receipt_items").select("description, quantity, unit_price")

    if (startDate && endDate) {
      query = query.gte("created_at", `${startDate}T00:00:00`).lte("created_at", `${endDate}T23:59:59`)
    }

    const { data: items, error } = await query

    if (error) {
      console.error("Error fetching receipt items:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group by description
    const grouped: Record<string, { quantity: number; revenue: number }> = {}
    items?.forEach((item: any) => {
      if (!grouped[item.description]) {
        grouped[item.description] = { quantity: 0, revenue: 0 }
      }
      grouped[item.description].quantity += item.quantity || 1
      grouped[item.description].revenue += (item.unit_price || 0) * (item.quantity || 1)
    })

    // Convert to array and sort by revenue
    const topProducts = Object.entries(grouped)
      .map(([description, data]) => ({
        description,
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)

    return NextResponse.json(topProducts)
  } catch (error) {
    console.error("Error fetching top products:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
