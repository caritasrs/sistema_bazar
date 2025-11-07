import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, receipt_number } = body

    // Placeholder for PIX QR code generation
    // In production, integrate with actual PIX API (Mercado Pago, Stripe, etc.)
    const pixData = {
      qrCode: `00020126580014br.gov.bcb.pix0136${receipt_number}520400005303986540${amount.toString().padStart(10, "0")}5802BR5913CARITAS RS6009PORTO ALEGR62410503***630441F5`,
      receipt_number,
      amount,
    }

    return NextResponse.json(pixData)
  } catch (error) {
    console.error("Error generating PIX QR code:", error)
    return NextResponse.json({ error: "Failed to generate PIX QR code" }, { status: 500 })
  }
}
