import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    const { receipt_id } = body

    if (!receipt_id) {
      return NextResponse.json({ error: "Receipt ID required" }, { status: 400 })
    }

    console.log("[v0] Confirming PIX payment for receipt:", receipt_id)

    // Get receipt and items
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .select(`
        *,
        items:receipt_items(
          *,
          item:items(*)
        )
      `)
      .eq("id", receipt_id)
      .single()

    if (receiptError || !receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    if (receipt.status !== "pending") {
      return NextResponse.json({ error: "Receipt is not pending" }, { status: 400 })
    }

    // Update receipt status to paid
    const { error: updateReceiptError } = await supabase
      .from("receipts")
      .update({ status: "paid" })
      .eq("id", receipt_id)

    if (updateReceiptError) {
      console.error("[v0] Error updating receipt:", updateReceiptError)
      throw updateReceiptError
    }

    // Update all items from reserved to sold
    for (const receiptItem of receipt.items) {
      const { error: updateItemError } = await supabase
        .from("items")
        .update({ status: "sold", sold_at: new Date().toISOString() })
        .eq("id", receiptItem.item_id)

      if (updateItemError) {
        console.error("[v0] Error updating item:", updateItemError)
      }
    }

    // Update transaction status
    const { error: updateTransError } = await supabase
      .from("transactions")
      .update({ status: "completed" })
      .eq("receipt_id", receipt_id)

    if (updateTransError) {
      console.error("[v0] Error updating transaction:", updateTransError)
    }

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: receipt.customer_id,
        action: "pix_payment_confirmed",
        table_name: "receipts",
        record_id: receipt_id,
      },
    ])

    console.log("[v0] PIX payment confirmed successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
