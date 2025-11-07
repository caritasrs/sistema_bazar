import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { receipt_id } = body

    // Update receipt with print timestamp
    const { data: receipt, error } = await supabase
      .from("receipts")
      .update({ printed_at: new Date().toISOString() })
      .eq("id", receipt_id)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        action: "receipt_printed",
        table_name: "receipts",
        record_id: receipt_id,
      },
    ])

    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error("Error logging print:", error)
    return NextResponse.json({ error: "Failed to log print" }, { status: 500 })
  }
}
