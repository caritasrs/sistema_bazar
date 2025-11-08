import { type NextRequest, NextResponse } from "next/server"
import { supabase as supabaseAdmin } from "@/lib/supabase-admin"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const itemId = params.id

    console.log("[v0] Updating item:", itemId, body)

    const { description, symbolic_value, condition, size, origin, category_id, batch_id, donor_id } = body

    // Build update object with only provided fields
    const updateData: any = {}
    if (description !== undefined) updateData.description = description
    if (symbolic_value !== undefined) updateData.symbolic_value = symbolic_value
    if (condition !== undefined) updateData.condition = condition
    if (size !== undefined) updateData.size = size || null
    if (origin !== undefined) updateData.origin = origin || null
    if (category_id !== undefined) updateData.category_id = category_id || null
    if (batch_id !== undefined) updateData.batch_id = batch_id || null
    if (donor_id !== undefined) updateData.donor_id = donor_id || null

    const { data, error } = await supabaseAdmin.from("items").update(updateData).eq("id", itemId).select().single()

    if (error) {
      console.error("[v0] Error updating item:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] Item updated successfully:", data)
    return NextResponse.json({ item: data })
  } catch (error: any) {
    console.error("[v0] Error in update item route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
