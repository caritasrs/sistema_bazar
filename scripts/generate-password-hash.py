import bcrypt

# Senha que queremos
password = "Caritas@2025Admin!"

# Gera o hash bcrypt
salt = bcrypt.gensalt(rounds=10)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

# Mostra o hash para usar no SQL
print("Hash gerado para a senha 'Caritas@2025Admin!':")
print(hashed.decode('utf-8'))
print("\n")

# Testa se o hash funciona
is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed)
print(f"Verificação do hash: {is_valid}")
