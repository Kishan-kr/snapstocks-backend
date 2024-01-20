const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const authenticate = (req, res, next) => {
  let token = req.session;
  let success = false;

  // Return error if token is not available 
  if(!token) {
    return res.status(401).json({success, error : "Token is not available"})
  }

  // verify the token 
  jwt.verify(token, secret, (error, decoded) => {
    if(error){
      res.status(401).json({success, error})
    }
    req.user = decoded;
    next()
  })
}

module.exports = authenticate;