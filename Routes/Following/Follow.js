const express = require('express');
const router = express.Router();
const authenticate = require('../../Middlewares/Authenticate');
const Following = require('../../Models/Following');

//@description     Follow another user
//@route           POST /api/following/userId
//@access          Protected
router.post('/:userId', authenticate, async (req, res) => {
  // Find the client's ID from the authenticated request
  const followerId = req.user.id;

  // Find the followee's ID from the param
  const followeeId = req.params.userId;

  try {
    // Create a following doc
    const following = await Following.create({ 
      follower: followerId, 
      followee: followeeId
    });

    // Error if unable to create
    if(!following) {
      return res.status(400).json({error: 'Unable to follow'})
    }

    // Return the following doc on success
    res.status(200).json({message: 'Followed', following});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
