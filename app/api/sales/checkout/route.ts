import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting checkout process")
    const supabase = getAdminClient()
    const body = await request.json()

    const { customer_id, items, payment_method, operator_name } = body

    console.log("[v0] Checkout request:", { customer_id, itemCount: items?.length, payment_method, operator_name })

    if (!customer_id || !items || items.length === 0) {
      console.error("[v0] Invalid checkout data:", { customer_id, itemsLength: items?.length })
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Calculate total
    const total_amount = items.reduce((sum: number, item: any) => sum + (item.unit_price || 0), 0)
    console.log("[v0] Total amount calculated:", total_amount)

    // Format: RCP-YYMMDDHHMM (RCP-2501071452 = 14 chars)
    const now = new Date()
    const yy = now.getFullYear().toString().slice(-2)
    const mm = (now.getMonth() + 1).toString().padStart(2, "0")
    const dd = now.getDate().toString().padStart(2, "0")
    const hh = now.getHours().toString().padStart(2, "0")
    const min = now.getMinutes().toString().padStart(2, "0")
    const ss = now.getSeconds().toString().padStart(2, "0")
    const receiptNumber = `RCP-${yy}${mm}${dd}${hh}${min}${ss}`
    console.log("[v0] Creating receipt:", receiptNumber)

    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert([
        {
          receipt_number: receiptNumber,
          customer_id,
          payment_method,
          total_amount,
          status: "paid",
          operator_name,
        },
      ])
      .select()
      .single()

    if (receiptError) {
      console.error("[v0] Receipt creation error:", receiptError.message)
      throw receiptError
    }
    console.log("[v0] Receipt created successfully:", receipt.id)

    // Create receipt items and update item status
    const receiptItems: any[] = []
    for (const item of items) {
      console.log("[v0] Processing item:", item.item_id)

      const { data: receiptItem, error: itemError } = await supabase
        .from("receipt_items")
        .insert([
          {
            receipt_id: receipt.id,
            item_id: item.item_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          },
        ])
        .select()
        .single()

      if (itemError) {
        console.error("[v0] Receipt item creation error:", itemError)
        throw itemError
      }
      receiptItems.push(receiptItem)

      // Update item status
      const { error: updateError } = await supabase
        .from("items")
        .update({ status: "sold", sold_at: new Date().toISOString() })
        .eq("id", item.item_id)

      if (updateError) {
        console.error("[v0] Item status update error:", updateError)
      }
    }

    // Create transaction record
    const { data: transaction, error: transError } = await supabase
      .from("transactions")
      .insert([
        {
          receipt_id: receipt.id,
          user_id: customer_id,
          transaction_type: "purchase",
          amount: total_amount,
          payment_method,
          status: "completed",
        },
      ])
      .select()
      .single()

    if (transError) {
      console.error("[v0] Transaction creation error:", transError)
      throw transError
    }

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: customer_id,
        action: "checkout_completed",
        table_name: "receipts",
        record_id: receipt.id,
      },
    ])

    console.log("[v0] Checkout completed successfully")
    return NextResponse.json({
      receipt,
      items: receiptItems,
      transaction,
    })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 })
  }
}
