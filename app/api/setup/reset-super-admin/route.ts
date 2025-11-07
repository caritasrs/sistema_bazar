import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"
import { hashPassword } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Generate correct hash
    const passwordHash = await hashPassword(password)
    console.log("[v0] Generated password hash:", passwordHash)

    const supabase = createClient()

    // Update super admin password
    const { data, error } = await supabase
      .from("users")
      .update({
        password_hash: passwordHash,
      })
      .eq("email", "sistema@caritasrs.org.br")
      .select()
      .single()

    if (error) {
      console.log("[v0] Update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Super admin password updated successfully")

    return NextResponse.json({
      success: true,
      message: "Super admin password updated",
      email: data.email,
    })
  } catch (error) {
    console.log("[v0] Setup error:", error)
    return NextResponse.json({ error: "Setup error" }, { status: 500 })
  }
}
