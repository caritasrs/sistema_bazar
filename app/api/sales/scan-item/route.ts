import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { qr_code } = body

    if (!qr_code) {
      return NextResponse.json({ error: "QR code is required" }, { status: 400 })
    }

    // Find item by QR code
    const { data: item, error } = await supabase
      .from("items")
      .select(`
        *,
        batch:donation_batches(*),
        category:categories(*)
      `)
      .eq("qr_code", qr_code)
      .eq("status", "available")
      .single()

    if (error || !item) {
      return NextResponse.json({ error: "Item not found or already sold" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error scanning item:", error)
    return NextResponse.json({ error: "Failed to scan item" }, { status: 500 })
  }
}
