
const User = require('../../Models/User')
const {body, validationResult} = require('express-validator')
const router = require('express').Router()

router.post('/create', [
  body('name', 'Name must contain alphabets only').isAlpha()
    .isLength({min:3}).withMessage('Name must contain minimum three letters'),
  body('email', 'Email is not valid').isEmail(),
  body('password').isLength({min:8}).withMessage('Minimum length of password must be 8')
    .not().isNumeric().withMessage('Password must contain an alphabet')
    .not().isAlpha().withMessage('Password must contain a number')
], (req, res) => {
  // extract errors from request 
  const errors = validationResult(req);

  // create user object from request body 
  // const user = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // }
  console.log(req.body)
  // send errors as response if available 
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(400).json(errors.array());
  }

  console.log('Request succussfull');

  // send successful respose 
  res.status(200).json({status: 'success', message: 'Successfully created account', user});
})

module.exports = router;