const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET 

function generateToken(payload) {
  return jwt.sign(payload, secret, {expiresIn: '7d'});
}

module.exports = generateToken;