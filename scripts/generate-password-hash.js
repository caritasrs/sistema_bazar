const bcrypt = require("bcrypt")

async function generateHash() {
  const password = "Caritas@2025Admin!"
  const hash = await bcrypt.hash(password, 12)
  console.log("Generated hash:", hash)
  console.log("Use this hash in the database")
}

generateHash().catch(console.error)
