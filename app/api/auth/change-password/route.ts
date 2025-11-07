import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "A nova senha deve ter pelo menos 8 caracteres" },
        { status: 400 },
      )
    }

    const supabase = createClient()

    // Verify current user
    const { data: users, error: fetchError } = await supabase.from("users").select("*").eq("email", email).single()

    if (fetchError || !users) {
      return NextResponse.json({ success: false, error: "Usuário não encontrado" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, users.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Senha atual incorreta" }, { status: 401 })
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
      .eq("email", email)

    if (updateError) {
      console.error("[v0] Error updating password:", updateError)
      return NextResponse.json({ success: false, error: "Erro ao atualizar senha" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Senha alterada com sucesso" })
  } catch (error) {
    console.error("[v0] Password change error:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
