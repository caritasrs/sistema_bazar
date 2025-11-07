import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get total sales count
    const { count: totalSales } = await supabase
      .from("receipts")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid")

    // Get total revenue
    const { data: receipts } = await supabase.from("receipts").select("total_amount").eq("status", "paid")

    const totalRevenue = receipts?.reduce((sum, r) => sum + Number.parseFloat(r.total_amount || "0"), 0) || 0

    // Get items in stock
    const { count: itemsInStock } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("status", "available")

    // Get active clients
    const { count: activeClients } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "client")
      .eq("status", "active")

    // Get scheduled visits (future dates)
    const today = new Date().toISOString().split("T")[0]
    const { count: scheduledVisits } = await supabase
      .from("schedules")
      .select("*", { count: "exact", head: true })
      .gte("schedule_date", today)
      .eq("status", "confirmed")

    // Calculate monthly growth (simplified - comparing this month vs last month)
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const firstDayThisMonthDate = firstDayThisMonth.split("T")[0]
    const firstDayLastMonthDate = firstDayLastMonth.split("T")[0]

    const { count: thisMonthSales } = await supabase
      .from("receipts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayThisMonth)
      .eq("status", "paid")

    const { count: lastMonthSales } = await supabase
      .from("receipts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayLastMonth)
      .lt("created_at", firstDayThisMonth)
      .eq("status", "paid")

    const monthlyGrowth = lastMonthSales ? (((thisMonthSales || 0) - lastMonthSales) / lastMonthSales) * 100 : 0

    return NextResponse.json({
      stats: {
        totalSales: totalSales || 0,
        totalRevenue: totalRevenue,
        itemsInStock: itemsInStock || 0,
        activeClients: activeClients || 0,
        monthlyGrowth: Math.round(monthlyGrowth),
        scheduledVisits: scheduledVisits || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
