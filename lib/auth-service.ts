import { createClient } from "./supabase-admin"

const bcrypt = require("bcryptjs")

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  cpf: string
  role: "super_admin" | "operator" | "client"
  status: "active" | "inactive" | "suspended"
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export async function validateNISTPassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push("Senha deve ter pelo menos 12 caracteres")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter pelo menos um número")
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Senha deve conter pelo menos um caractere especial")
  }

  return { valid: errors.length === 0, errors }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function authenticateUser(
  credentials: LoginCredentials,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", credentials.email)
      .eq("status", "active")
      .maybeSingle()

    if (error || !data) {
      return { success: false, error: "Usuário não encontrado" }
    }

    const passwordMatch = await verifyPassword(credentials.password, data.password_hash)

    if (!passwordMatch) {
      return { success: false, error: "Senha incorreta" }
    }

    const { password_hash, ...user } = data
    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Erro ao autenticar usuário" }
  }
}

export async function createUser(
  email: string,
  name: string,
  cpf: string,
  password: string,
  role: "operator" | "client",
  phone?: string,
  address?: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const passwordValidation = await validateNISTPassword(password)
    if (!passwordValidation.valid) {
      return { success: false, error: `Senha inválida: ${passwordValidation.errors.join(", ")}` }
    }

    const passwordHash = await hashPassword(password)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        name,
        cpf,
        password_hash: passwordHash,
        role,
        status: "active",
        phone,
        address,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const { password_hash, ...user } = data
    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Erro ao criar usuário" }
  }
}
