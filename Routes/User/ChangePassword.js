const router = require('express').Router()
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const User = require('../../Models/User');
const authenticate = require('../../Middlewares/Authenticate');

//@description     Change password for logged in user
//@route           PUT /api/users/change-password
//@access          Protected
router.put('/change-password', authenticate, [
  body('currentPassword', 'Current password must exist').exists(),
  body('newPassword').isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
    .not().isNumeric().withMessage('Password must contain an alphabet')
    .not().isAlpha().withMessage('Password must contain a number')
    .not().isUppercase().withMessage('Password must contain a lowercase letter')
    .not().isLowercase().withMessage('Password must contain a uppercase letter')
], async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // check for validation errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ error: errors.array() });
  }

  try {
    const user = await User.findById(userId);
    // Return if user does not exist  
    if (!user) {
      console.log('User does not exist')
      return res.status(404).json({ error: 'Bad request' })
    }

    // verify password for authentication 
    const previousHash = user.password
    const isCorrect = bcrypt.compareSync(currentPassword, previousHash);

    if (!isCorrect) {
      return res.status(401).json({ error: "Unauthorized access: Incorrect password" })
    }

    // generate salt for the password 
    const salt = await bcrypt.genSalt(10);

    // create hash for the password 
    const hash = await bcrypt.hash(newPassword, salt)

    // update user's password 
    const updatedUser = await User.findByIdAndUpdate(userId, {password: hash}, {new: true});

    if(!updatedUser) {
      console.error('Error updating password')
      return res.status(501).json({success, error: 'Error updating password'})
    }

    success = true;
    res.status(200).json({message: 'Password updated successfully', updatedUser})

  } catch (error) {
    if(error) {
      console.error('Error updating password: ', error)
      res.status(500).json({ error: 'Server error'})
    }
  }
})

module.exports = router;