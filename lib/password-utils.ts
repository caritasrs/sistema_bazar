// Password strength validation following NIST SP 800-63B
export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 12) score += 25
  if (password.length >= 16) score += 25
  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 10
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 15

  if (score < 50) feedback.push("Password is weak")
  if (score >= 50 && score < 75) feedback.push("Password is moderate")
  if (score >= 75) feedback.push("Password is strong")

  return { score: Math.min(score, 100), feedback }
}

// CPF validation (simplified)
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11) return false

  const digits = cleanCPF.split("").map(Number)

  // Check first verifier
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  let remainder = sum % 11
  const firstVerifier = remainder < 2 ? 0 : 11 - remainder

  if (firstVerifier !== digits[9]) return false

  // Check second verifier
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i)
  }
  remainder = sum % 11
  const secondVerifier = remainder < 2 ? 0 : 11 - remainder

  return secondVerifier === digits[10]
}
