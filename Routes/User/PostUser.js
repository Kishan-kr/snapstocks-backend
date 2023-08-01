
const User = require('../../Models/User')
const {body, validationResult} = require('express-validator')
const router = require('express').Router()

// Endpoint to create a user 
router.post('/create', [
  body('name', 'Name must contain alphabets only').isAlpha()
    .isLength({min:3}).withMessage('Name must contain minimum three letters'),
  body('email', 'Email is not valid').isEmail(),
  body('password').isLength({min:8}).withMessage('Minimum length of password must be 8')
    .not().isNumeric().withMessage('Password must contain an alphabet')
    .not().isAlpha().withMessage('Password must contain a number')
], async (req, res) => {
  let success = false;

  // extract errors from request 
  const errors = validationResult(req);

  // send errors as response if available 
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(400).json(success, errors.array());
  }
  
  // check if user with same email already exists
  const userExists = await User.findOne({email: req.body.email})

  if(userExists) {
    return res.status(409).json({success, message: 'User already exists with this email'})
  }

  // create hash for the password 

  // create user object from request body and send success response
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).then((user) => {
    success = true;
    res.status(200).json({success, message: 'Successfully created account', user});
  })
})

module.exports = router;