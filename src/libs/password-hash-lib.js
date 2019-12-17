const passwordHash = require("password-hash")

function createSeed() {
  return Math.floor(Math.random() * 10 + 1)
}

function generateHashPassword(seededPassword) {
  return passwordHash.generate(seededPassword)
}

function verifyHashPassword(password , hashedPassword){
  return passwordHash.verify(password , hashedPassword)
}

exports.createSeed = createSeed;
exports.generateHashPassword = generateHashPassword;
exports.verifyHashPassword = verifyHashPassword;
