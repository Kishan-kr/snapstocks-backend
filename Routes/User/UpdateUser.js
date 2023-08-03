const fetchUserData = require('../../Middlewares/FetchUserData');
const User = require('../../Models/User');

const router = require('express').Router();

router.put('/', fetchUserData, async (req, res) => {
  const userId = req.user.id;
  const updateFields = req.body
  let success = false;

  // Check if 'email' or 'password' fields are present in the updateFields object
  if ('email' in updateFields || 'password' in updateFields) {
    return res.status(400).json({success, error: 'Updating email or password is not allowed here' });
  }

  try {
    // Find user information from DB and update
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })


    if (!updatedUser) {
      return res.status(404).json({ success, error: 'User not found' });
    }

    success = true;
    return res.status(200).json({success, updatedUser});

  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'An error occurred while updating user' });
  }
})
module.exports = router;