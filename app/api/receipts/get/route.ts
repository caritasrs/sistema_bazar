import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const receiptId = searchParams.get("id")
    const receiptNumber = searchParams.get("number")

    if (!receiptId && !receiptNumber) {
      return NextResponse.json({ error: "Receipt ID or number required" }, { status: 400 })
    }

    let query = supabase.from("receipts").select(`
        *,
        customer:users(*),
        items:receipt_items(
          *,
          item:items(*)
        )
      `)

    if (receiptId) {
      query = query.eq("id", receiptId)
    } else {
      query = query.eq("receipt_number", receiptNumber)
    }

    const { data: receipt, error } = await query.single()

    if (error) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 })
  }
}
