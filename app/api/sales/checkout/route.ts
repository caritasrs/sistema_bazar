import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { generatePixPayload } from "@/lib/pix-generator"

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

    let pixPayload = null
    let receiptStatus = "paid" // Default for cash

    if (payment_method === "pix") {
      receiptStatus = "pending" // PIX starts as pending until confirmed

      // Fetch PIX settings from database
      const { data: settings } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["pix_key", "merchant_name", "merchant_city"])

      const settingsObj =
        settings?.reduce((acc: any, s: any) => {
          acc[s.key] = s.value
          return acc
        }, {}) || {}

      console.log("[v0] PIX settings loaded:", settingsObj)

      if (!settingsObj.pix_key) {
        console.error("[v0] PIX key not configured")
        return NextResponse.json(
          {
            error: "Chave PIX não configurada. Configure em Configurações PIX.",
          },
          { status: 400 },
        )
      }

      // Generate PIX payload using BR Code standard
      pixPayload = generatePixPayload({
        pixKey: settingsObj.pix_key,
        merchantName: settingsObj.merchant_name || "Caritas RS",
        merchantCity: settingsObj.merchant_city || "Porto Alegre",
        amount: total_amount,
        txid: receiptNumber,
      })

      console.log("[v0] PIX payload generated:", pixPayload.substring(0, 50) + "...")
    }

    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert([
        {
          receipt_number: receiptNumber,
          customer_id,
          payment_method,
          total_amount,
          status: receiptStatus,
          operator_name,
          pix_url: pixPayload,
        },
      ])
      .select()
      .single()

    if (receiptError) {
      console.error("[v0] Receipt creation error:", receiptError.message)
      throw receiptError
    }
    console.log("[v0] Receipt created successfully:", receipt.id)

    // Create receipt items (don't update item status yet if PIX pending)
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

      if (payment_method === "cash") {
        const { error: updateError } = await supabase
          .from("items")
          .update({ status: "sold", sold_at: new Date().toISOString() })
          .eq("id", item.item_id)

        if (updateError) {
          console.error("[v0] Item status update error:", updateError)
        }
      } else {
        // Reserve items for PIX payment
        const { error: reserveError } = await supabase
          .from("items")
          .update({ status: "reserved" })
          .eq("id", item.item_id)

        if (reserveError) {
          console.error("[v0] Item reserve error:", reserveError)
        }
      }
    }

    // Create transaction record
    const transactionStatus = payment_method === "pix" ? "pending" : "completed"
    const { data: transaction, error: transError } = await supabase
      .from("transactions")
      .insert([
        {
          receipt_id: receipt.id,
          user_id: customer_id,
          transaction_type: "purchase",
          amount: total_amount,
          payment_method,
          status: transactionStatus,
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
        action: `checkout_${receiptStatus}`,
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
