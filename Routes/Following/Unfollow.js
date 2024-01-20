const express = require('express');
const router = express.Router();
const authenticate = require('../../Middlewares/Authenticate');
const Following = require('../../Models/Following');

//@description     Unfollow a user
//@route           Delete /api/following/userId
//@access          Protected
router.delete('/:userId', authenticate, async (req, res) => {
  // Find the client's ID from the authenticated request
  const followerId = req.user.id;

  // Find the followee's ID from the param
  const followeeId = req.params.userId;

  try {
    // Delete the matching doc
    const deletedFollowing = await Following.findOneAndDelete({ 
      follower: followerId, 
      followee: followeeId
    });

    // Error if unable to delete
    if(!deletedFollowing) {
      return res.status(400).json({error: 'Unable to unfollow'})
    }

    // Return the following doc on success
    res.status(200).json({message: 'Unfollowed', deletedFollowing});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
