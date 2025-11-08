import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { qr_code } = body

    console.log("[v0] Scanning item with QR code:", qr_code)

    if (!qr_code) {
      return NextResponse.json({ error: "QR code is required" }, { status: 400 })
    }

    const { data: allItems, error: listError } = await supabase
      .from("items")
      .select("id, qr_code, description, status")
      .limit(5)

    console.log("[v0] Sample items from database:", allItems)

    const { data: itemCheck, error: checkError } = await supabase
      .from("items")
      .select("id, description, status, qr_code")
      .eq("qr_code", qr_code)
      .maybeSingle()

    console.log("[v0] Item exists check:", {
      found: !!itemCheck,
      status: itemCheck?.status,
      description: itemCheck?.description,
      qr_code_searched: qr_code,
      qr_code_in_db: itemCheck?.qr_code,
    })

    if (!itemCheck) {
      console.log("[v0] Item does not exist in database")
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const { data: item, error } = await supabase
      .from("items")
      .select(`
        *,
        batch:donation_batches(*),
        category:categories(*)
      `)
      .eq("qr_code", qr_code)
      .eq("status", "available")
      .maybeSingle()

    console.log("[v0] Item search with status filter:", { found: !!item, error })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!item) {
      console.log("[v0] Item found but status is not 'available'. Current status:", itemCheck.status)
      return NextResponse.json(
        {
          error: `Item is not available for sale. Current status: ${itemCheck.status || "undefined"}`,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Item found and available:", item.description)
    return NextResponse.json(item)
  } catch (error) {
    console.error("[v0] Error scanning item:", error)
    return NextResponse.json({ error: "Failed to scan item" }, { status: 500 })
  }
}
