import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    console.log("[v0] Creating item:", body)

    // Generate QR code if not provided
    const qrCode = body.qr_code || `QR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: item, error } = await supabase
      .from("items")
      .insert({
        qr_code: qrCode,
        batch_id: body.batch_id,
        category_id: body.category_id,
        description: body.description,
        size: body.size,
        condition: body.condition,
        symbolic_value: body.symbolic_value,
        origin: body.origin,
        status: "available",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating item:", error)
      throw error
    }

    // Update batch total items
    if (body.batch_id) {
      const { data: batch } = await supabase
        .from("donation_batches")
        .select("total_items, total_value")
        .eq("id", body.batch_id)
        .single()

      if (batch) {
        await supabase
          .from("donation_batches")
          .update({
            total_items: (batch.total_items || 0) + 1,
            total_value: (
              Number.parseFloat(batch.total_value || "0") + Number.parseFloat(body.symbolic_value || "0")
            ).toFixed(2),
          })
          .eq("id", body.batch_id)
      }
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("[v0] Error in item creation:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
