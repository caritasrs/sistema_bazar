-- Verificar e criar super admin sistema@caritasrs.org.br
-- Senha: Caritas@2025Admin!
-- Hash bcrypt com 12 rounds

-- Primeiro, deletar se existir (para evitar conflitos)
DELETE FROM users WHERE email = 'sistema@caritasrs.org.br';

-- Inserir novo super admin com CPF único e senha criptografada
INSERT INTO users (
  email,
  name,
  cpf,
  password_hash,
  role,
  status,
  phone,
  address,
  created_at,
  updated_at
) VALUES (
  'sistema@caritasrs.org.br',
  'Sistema Cáritas',
  '111.111.111-11',
  '$2a$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Oy1sPu.MxJQcF2FO',
  'super_admin',
  'active',
  '(51) 3000-0000',
  'Rua do Sistema, 100 - Porto Alegre, RS',
  NOW(),
  NOW()
);

-- Verificar inserção
SELECT id, email, role, status FROM users WHERE email = 'sistema@caritasrs.org.br';
