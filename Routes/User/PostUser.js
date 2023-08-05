
const User = require('../../Models/User')
const { body, validationResult } = require('express-validator')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const generateToken = require('../../Middlewares/GenerateToken');

// Endpoint to create a user 
router.post('/', [
  body('name', 'Name must contain alphabets only').isAlpha()
    .isLength({ min: 3 }).withMessage('Name must contain minimum three letters'),
  body('email', 'Email is not valid').isEmail(),
  body('password').isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
    .not().isNumeric().withMessage('Password must contain an alphabet')
    .not().isAlpha().withMessage('Password must contain a number')
    .not().isUppercase().withMessage('Password must contain a lowercase letter')
    .not().isLowercase().withMessage('Password must contain a uppercase letter')
], async (req, res) => {
  let success = false;

  // destructure properties from request body 
  const { name, email, password } = req.body;

  // extract errors from request 
  const errors = validationResult(req);

  // send errors as response if available 
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({success, error:errors.array()});
  }

  try {
    // check if user with same email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(409).json({ success, error: 'User already exists with this email' })
    }

    // generate salt for the password 
    const salt = await bcrypt.genSalt(10);

    // create hash for the password 
    const hash = await bcrypt.hash(password, salt)

    // create user object from request body and send success response
    User.create({
      name: name,
      email: email,
      password: hash,
    }).then((user) => {
      // generate jwt token 
      const payload = {
        id: user.id,
        name,
        email,
      }
      const token = generateToken(payload)

      success = true;
      res.status(200).json({ success, message: 'Successfully created account', token });
    })
  } catch (error) {
    if(error) {
      console.error('Error creating account: ', error)
      res.status(500).json({success, error: 'Error occurred while creating account'})
    }
  }
})

module.exports = router;