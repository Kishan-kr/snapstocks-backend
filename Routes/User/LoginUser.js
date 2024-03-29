const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const User = require('../../Models/User');
const generateToken = require('../../Utils/GenerateToken');

const router = require('express').Router();

//@description     To login
//@route           POST /api/users/login
//@access          Public  
router.post('/login', [
  body('email', 'Email is not valid').isEmail(),
  body('password', 'Password must not be empty').exists()
], async (req, res) => {
  // destructure credentials from request body 
  const {email, password} = req.body;

  // return if validation error exists 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()})
  }

  try {
    // find user with the provided email 
    const user = await User.findOne({email})

    // Return if user does not exist with this email 
    if(!user) {
      return res.status(404).json({error: 'User with this email does not exist'})
    }

    // verify password for authentication 
    const hash = user.password
    const isCorrect = bcrypt.compareSync(password, hash);

    if(!isCorrect) {
      return res.status(401).json({error: 'Unauthorized access'})
    }

    // generate jwt token 
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    const token = generateToken(payload)

    res.status(200).json({message: 'Login successful', token});
    
  } catch (error) {
    if(error) {
      console.error('Error logging in: ', error);
      res.status(500).json({error: 'Server error'})
    }
  }
})
module.exports = router;