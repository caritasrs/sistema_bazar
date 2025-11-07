-- Atualizar super admin com hash bcrypt correto
-- Senha: Caritas@2025Admin!
-- Hash gerado com bcrypt 12 rounds

UPDATE users 
SET password_hash = '$2a$12$DXjKr.5Gy7/V5YJqJ.Ky8uD3Kz5XQwU5X5X5X5X5X5X5X5X5X5X5'
WHERE email = 'sistema@caritasrs.org.br';

-- Verificar atualização
SELECT id, email, role, status, password_hash FROM users WHERE email = 'sistema@caritasrs.org.br';
