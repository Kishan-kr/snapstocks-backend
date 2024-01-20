const express = require('express');
const router = express.Router();
const authenticate = require('../../Middlewares/Authenticate');
const Following = require('../../Models/Following');
const Image = require('../../Models/Image');

//@description     Get images from users the client is following
//@route           GET /api/following/images
//@access          Protected
router.get('/images', authenticate, async (req, res) => {
  const items = Number(req.query.items) || 10; //items per page 
  const page = Number(req.query.page) || 1 // page no
  const skipCount = (page - 1) * items;

  try {
    // Find the user's ID from the authenticated request
    const userId = req.user.id;

    // Find users the client is following
    const following = await Following.find({ follower: userId }).select('followee');

    // Extract an array of user IDs from the "following" result
    const followingIds = following.map((followedUser) => followedUser.followee);

    // Retrieve images from users the client is following
    const images = await Image.find({ user: { $in: followingIds } })
    .sort('-createdAt')
    .skip(skipCount)
    .limit(items)
    .populate({path: 'user', select: 'name profilePic hireable'});

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
