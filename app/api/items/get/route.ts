import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const qrCode = searchParams.get("qr_code")

    if (!qrCode) {
      return NextResponse.json({ error: "QR Code é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: item, error } = await supabase
      .from("items")
      .select(
        `
        *,
        category:categories(id, name),
        batch:donation_batches(id, batch_number),
        donor:donors(id, name, type)
      `,
      )
      .eq("qr_code", qrCode)
      .single()

    if (error) {
      console.error("[v0] Error fetching item:", error)
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error: any) {
    console.error("[v0] Error in item fetch:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
