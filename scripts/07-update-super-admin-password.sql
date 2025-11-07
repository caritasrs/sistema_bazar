-- Atualiza APENAS a senha do super admin existente
-- Execute o script Python primeiro para gerar o hash, depois use-o aqui

UPDATE users 
SET password_hash = '$2b$10$N5Z5Z5Z5Z5Z5Z5Z5Z5Z5ZuqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq'
WHERE email = 'sistema@caritasrs.org.br';

-- Verifica se atualizou
SELECT email, role, created_at 
FROM users 
WHERE email = 'sistema@caritasrs.org.br';
