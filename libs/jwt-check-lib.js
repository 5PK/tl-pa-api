import "dotenv/config"
import {unauthorized, webtokenerror} from "../libs/response-lib"
import jwt from 'jsonwebtoken'


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
            return res.send(unauthorized({"error": true, "message": 'Unauthorized access.' }))
        }
      req.decoded = decoded
      next()
    })
  } else {
    // if there is no token
    // return an error
    return res.send(webtokenerror({"error": true, "message": 'No token provided.' }))
  }
}