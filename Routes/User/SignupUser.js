
const User = require('../../Models/User')
const { body, validationResult } = require('express-validator')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const generateToken = require('../../Utils/GenerateToken');
const { isValidUsername } = require('../../Utils/CustomValidators');

//@description     Register new user
//@route           POST /api/users/
//@access          Public  
router.post('/',
  [
    body('name.firstName', 'First name must contain alphabets only')
      .isAlpha()
      .isLength({ min: 3 })
      .withMessage('First name must contain minimum three letters'),

    body('name.lastName', 'Last name must contain alphabets only')
      .optional()
      .isAlpha()
      .isLength({ min: 3 })
      .withMessage('Last name must contain minimum three letters'),

    body('email', 'Invalid email address').isEmail(),

    body('username')
      .isLength({ min: 3 })
      .withMessage('Minimum length of username must be 3')
      .isString()
      .custom(isValidUsername)
      .withMessage('Username can only contain numbers, alphabets, and underscores')
      .custom(async (value) => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          throw new Error('Username is already taken');
        }
      }),

    body('password')
      .isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
      .not().isNumeric().withMessage('Password must contain an alphabet')
      .not().isAlpha().withMessage('Password must contain a number')
      .not().isUppercase().withMessage('Password must contain a lowercase letter')
      .not().isLowercase().withMessage('Password must contain a uppercase letter')

  ], async (req, res) => {

    // destructure properties from request body 
    const { name, username, email, password } = req.body;

    // extract errors from request 
    const errors = validationResult(req);

    // send errors as response if available 
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // check if user with same email already exists
      const userExists = await User.findOne({ email })

      if (userExists) {
        return res.status(409).json({ error: 'User already exists with this email' })
      }

      // generate salt for the password 
      const salt = await bcrypt.genSalt(10);

      // create hash for the password 
      const hash = await bcrypt.hash(password, salt)

      // create user object from request body and send success response
      User.create({
        name,
        email,
        username,
        password: hash,
      }).then((user) => {
        // generate jwt token 
        const payload = {
          id: user.id,
          name,
          email,
        }
        const token = generateToken(payload)

        res.status(200).json({ message: 'Sign up successfully', token });
      })
    } catch (error) {
      if (error) {
        console.error('Error creating account: ', error)
        res.status(500).json({ error: 'Server error' })
      }
    }
  })

module.exports = router;