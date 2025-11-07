import { createClient } from "@/lib/supabase-admin"
import { hashPassword } from "@/lib/auth-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json({ success: false, error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Generate correct hash
    const passwordHash = await hashPassword(password)
    console.log("[v0] Generated password hash for email:", email)

    const supabase = createClient()

    // Update user with correct password hash
    const { data, error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq("email", email)
      .select()
      .single()

    if (error) {
      console.log("[v0] Error updating password:", error)
      return Response.json({ success: false, error: `Erro ao atualizar senha: ${error.message}` }, { status: 400 })
    }

    console.log("[v0] Password initialized successfully for:", email)
    return Response.json({
      success: true,
      message: "Senha inicializada com sucesso. Tente fazer login agora.",
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    })
  } catch (error) {
    console.log("[v0] Setup error:", error)
    return Response.json({ success: false, error: "Erro ao inicializar senha" }, { status: 500 })
  }
}
