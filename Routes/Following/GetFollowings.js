const express = require('express');
const router = express.Router();
const authenticate = require('../../Middlewares/Authenticate');
const Following = require('../../Models/Following');

//@description     Get the users client is following
//@route           GET /api/following/
//@access          Protected
router.get('/', authenticate, async (req, res) => {
  // Find the client's ID from the authenticated request
  const userId = req.user.id;

  try {
    // Find users the client is following
    const following = await Following.find({ follower: userId })
    .select('followee')
    .populate({path: 'followee', select: 'name username profilePic'});

    // Return the array of following docs
    res.status(200).json({ following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
