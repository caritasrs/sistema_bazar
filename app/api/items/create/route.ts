import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    console.log("[v0] Creating item with data:", body)

    if (!body.description) {
      console.error("[v0] Missing required field: description")
      return NextResponse.json({ error: "Descrição é obrigatória" }, { status: 400 })
    }

    if (!body.symbolic_value) {
      console.error("[v0] Missing required field: symbolic_value")
      return NextResponse.json({ error: "Valor simbólico é obrigatório" }, { status: 400 })
    }

    if (!body.condition) {
      console.error("[v0] Missing required field: condition")
      return NextResponse.json({ error: "Condição é obrigatória" }, { status: 400 })
    }

    const { data: uuidData } = await supabase.rpc("gen_random_uuid")
    const qrCode = body.qr_code || crypto.randomUUID()

    const itemData: any = {
      qr_code: qrCode,
      description: body.description,
      condition: body.condition,
      symbolic_value: Number.parseFloat(body.symbolic_value),
      status: "available",
    }

    if (body.batch_id) itemData.batch_id = body.batch_id
    if (body.category_id) itemData.category_id = body.category_id
    if (body.donor_id) itemData.donor_id = body.donor_id
    if (body.size) itemData.size = body.size
    if (body.origin) itemData.origin = body.origin

    console.log("[v0] Inserting item with UUID QR code:", qrCode)
    console.log("[v0] Item data:", itemData)

    const { data: item, error } = await supabase.from("items").insert(itemData).select().single()

    if (error) {
      console.error("[v0] Database error creating item:", error)
      return NextResponse.json({ error: `Erro ao criar item: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Item created successfully with status:", item.status)

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
  } catch (error: any) {
    console.error("[v0] Error in item creation:", error)
    return NextResponse.json({ error: `Erro ao processar solicitação: ${error.message}` }, { status: 500 })
  }
}
