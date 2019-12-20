
require("dotenv/config")
const rl = require("../libs/response-lib")
const jwt = require("jsonwebtoken")


module.exports = (req,res,next) => {

  console.log("=========================================")
  console.log(req.headers.jwt)
  console.log("=========================================")

  const token = req.headers.jwt
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.log(err)
            return res.send(rl.unauthorized({"error": true, "message": 'Unauthorized access.' }))
        }
      req.decoded = decoded
      next()
    })
  } else {
    // if there is no token
    // return an error
    return res.send(rl.webtokenerror({"error": true, "message": 'No token provided.' }))
  }
}