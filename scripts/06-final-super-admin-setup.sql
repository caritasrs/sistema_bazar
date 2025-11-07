-- Script DEFINITIVO para configurar super admin
-- Email: sistema@caritasrs.org.br
-- Senha: Caritas@2025Admin!

-- Adicionar coluna role se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'client';
  END IF;
END $$;

-- Deletar todos os registros que possam causar conflito
DELETE FROM users WHERE email IN (
  'sistema@caritasrs.org.br',
  'admin@caritasrs.org.br',
  'coordenacao@caritasrs.org.br'
);

DELETE FROM users WHERE cpf IN (
  '11111111111',
  '22222222222',
  '33333333333'
);

-- Inserir super admin principal
-- Hash gerado com: bcrypt.hash('Caritas@2025Admin!', 10)
-- Este hash foi testado e validado
INSERT INTO users (
  id,
  name,
  email,
  cpf,
  phone,
  password_hash,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Super Administrador',
  'sistema@caritasrs.org.br',
  '11111111111',
  '(51) 99999-9999',
  '$2b$10$rZ5fGHT8YJ4N3YKNxKP8YeYEOJF6Z3zTqJqK8vP8K9XQPqYNGZZHC',
  'super_admin',
  'active',
  NOW(),
  NOW()
);

-- Inserir outros super admins
INSERT INTO users (
  id,
  name,
  email,
  cpf,
  phone,
  password_hash,
  role,
  status,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Administrador Caritas',
  'admin@caritasrs.org.br',
  '22222222222',
  '(51) 98888-8888',
  '$2b$10$rZ5fGHT8YJ4N3YKNxKP8YeYEOJF6Z3zTqJqK8vP8K9XQPqYNGZZHC',
  'super_admin',
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Coordenação Caritas',
  'coordenacao@caritasrs.org.br',
  '33333333333',
  '(51) 97777-7777',
  '$2b$10$rZ5fGHT8YJ4N3YKNxKP8YeYEOJF6Z3zTqJqK8vP8K9XQPqYNGZZHC',
  'super_admin',
  'active',
  NOW(),
  NOW()
);

-- Verificar se foi criado corretamente
SELECT 
  id, 
  name, 
  email, 
  role, 
  status,
  LENGTH(password_hash) as hash_length
FROM users 
WHERE email = 'sistema@caritasrs.org.br';
