const express = require('express');
const router = express.Router();
const authenticate = require('../../Middlewares/Authenticate');
const Following = require('../../Models/Following');
const DownloadHistory = require('../../Models/DownloadHistory');

//@description     Get download list of images
//@route           GET /api/downloads/
//@access          Protected
router.get('/', authenticate, async (req, res) => {
  // Find the client's ID from the authenticated request
  const userId = req.user.id;

  const items = Number(req.query.items) || 10;
  const page = Number(req.query.page) || 1;
  const skipCount = (page - 1) * items;

  try {
    // Find the list of downloaded images
    const downloads = await DownloadHistory.find({ user: userId })
    .sort('-createdAt')
    .skip(skipCount)
    .limit(items)
    .populate({
      path: 'image', 
      select: 'user imageUrl',
      populate: {
        path: 'user',
        select: 'name username'
      }
    });

    // Return the array of downloaded docs
    res.status(200).json({ downloads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
