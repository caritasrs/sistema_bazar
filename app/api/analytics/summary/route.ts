import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const startDate =
      searchParams.get("start_date") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = searchParams.get("end_date") || new Date().toISOString().split("T")[0]

    // Get total sales
    const { data: sales, error: salesError } = await supabase
      .from("receipts")
      .select("total_amount")
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)

    if (salesError) {
      console.error("Error fetching sales:", salesError)
    }

    const totalSales = sales?.reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0) || 0
    const totalTransactions = sales?.length || 0

    // Get total donations
    const { data: donations, error: donationsError } = await supabase
      .from("items")
      .select("symbolic_value")
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)

    if (donationsError) {
      console.error("Error fetching donations:", donationsError)
    }

    const totalDonationValue = donations?.reduce((sum: number, i: any) => sum + (i.symbolic_value || 0), 0) || 0
    const totalDonations = donations?.length || 0

    // Get active customers
    const { data: customers, error: customersError } = await supabase.from("users").select("id").eq("status", "active")

    if (customersError) {
      console.error("Error fetching customers:", customersError)
    }

    const activeCustomers = customers?.length || 0

    // Get scheduled appointments
    const { data: schedules, error: schedulesError } = await supabase
      .from("schedules")
      .select("id")
      .eq("status", "confirmed")
      .gte("schedule_date", startDate)
      .lte("schedule_date", endDate)

    if (schedulesError) {
      console.error("Error fetching schedules:", schedulesError)
    }

    const upcomingSchedules = schedules?.length || 0

    return NextResponse.json({
      totalSales,
      totalTransactions,
      totalDonationValue,
      totalDonations,
      activeCustomers,
      upcomingSchedules,
      period: { startDate, endDate },
    })
  } catch (error) {
    console.error("Error fetching analytics summary:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
