import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const donorId = searchParams.get("id")

    if (!donorId) {
      return NextResponse.json({ error: "Donor ID required" }, { status: 400 })
    }

    // Get donor info
    const { data: donor } = await supabase.from("donors").select("*").eq("id", donorId).single()

    // Get all batches from this donor
    const { data: batches } = await supabase
      .from("donation_batches")
      .select(`
        *,
        items(*)
      `)
      .eq("donor_id", donorId)
      .order("created_at", { ascending: false })

    // Get sales tracking for items from this donor
    const allItems = batches?.flatMap((b) => b.items) || []
    const soldItems = allItems.filter((i) => i.status === "sold")
    const availableItems = allItems.filter((i) => i.status === "available")

    return NextResponse.json({
      donor,
      batches,
      statistics: {
        total_items: allItems.length,
        sold_items: soldItems.length,
        available_items: availableItems.length,
        sale_rate: allItems.length > 0 ? ((soldItems.length / allItems.length) * 100).toFixed(1) : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching traceability:", error)
    return NextResponse.json({ error: "Failed to fetch traceability" }, { status: 500 })
  }
}
