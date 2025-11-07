import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { campaign_id, target_users, channel, message_template } = body

    if (!campaign_id || !target_users || target_users.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Create communication records for each target user
    const communications = target_users.map((user_id: string) => ({
      campaign_id,
      user_id,
      channel,
      sent_at: new Date().toISOString(),
      status: "sent",
    }))

    const { data: createdComms, error } = await supabase.from("campaign_communications").insert(communications).select()

    if (error) throw error

    // TODO: In production, integrate with actual email/WhatsApp APIs
    // - Email via SendGrid/AWS SES
    // - WhatsApp via Twilio/Zenvia

    return NextResponse.json({
      total_sent: createdComms.length,
      communications: createdComms,
    })
  } catch (error) {
    console.error("Error sending communication:", error)
    return NextResponse.json({ error: "Failed to send communication" }, { status: 500 })
  }
}
