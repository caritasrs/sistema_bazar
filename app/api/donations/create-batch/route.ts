import { createClient } from "@/lib/supabase-server"
import { generateQRCode } from "@/lib/format-utils"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { donor_id, notes_url, items } = body

    if (!donor_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Create batch
    const batchNumber = `BATCH-${Date.now()}`
    const { data: batch, error: batchError } = await supabase
      .from("donation_batches")
      .insert([
        {
          batch_number: batchNumber,
          donor_id,
          notes_url,
          status: "open",
          total_items: items.length,
        },
      ])
      .select()
      .single()

    if (batchError) throw batchError

    // Create items with QR codes
    const itemsData = items.map((item: any) => ({
      qr_code: generateQRCode(),
      batch_id: batch.id,
      category_id: item.category_id,
      description: item.description,
      size: item.size,
      condition: item.condition,
      symbolic_value: item.symbolic_value,
      origin: item.origin,
      status: "available",
    }))

    const { data: createdItems, error: itemsError } = await supabase.from("items").insert(itemsData).select()

    if (itemsError) throw itemsError

    return NextResponse.json({
      batch,
      items: createdItems,
    })
  } catch (error) {
    console.error("Error creating donation batch:", error)
    return NextResponse.json({ error: "Failed to create donation batch" }, { status: 500 })
  }
}
