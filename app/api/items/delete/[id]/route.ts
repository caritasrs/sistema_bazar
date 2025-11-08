import { type NextRequest, NextResponse } from "next/server"
import { supabase as supabaseAdmin } from "@/lib/supabase-admin"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const itemId = params.id

    console.log("[v0] Deleting item:", itemId)

    // Check if item exists and is not sold
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("items")
      .select("id, status, description")
      .eq("id", itemId)
      .single()

    if (fetchError || !item) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
    }

    if (item.status === "sold") {
      return NextResponse.json({ error: "Não é possível excluir um item já vendido" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("items").delete().eq("id", itemId)

    if (error) {
      console.error("[v0] Error deleting item:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] Item deleted successfully:", itemId)
    return NextResponse.json({ message: "Item excluído com sucesso" })
  } catch (error: any) {
    console.error("[v0] Error in delete item route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
