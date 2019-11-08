import passwordHash from "password-hash"

export function createSeed() {
  return Math.floor(Math.random() * 10 + 1)
}

export function generateHashPassword(seededPassword) {
  return passwordHash.generate(seededPassword)
}

export function verifyHashPassword(password , hashedPassword){
  return passwordHash.verify(password , hashedPassword)
}