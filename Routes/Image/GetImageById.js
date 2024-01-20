const trackImageViews = require('../../Middlewares/TrackImageViews');
const Image = require('../../Models/Image');
const router = require('express').Router();

//@description     Get an image by id
//@route           GET /api/images/imageid
//@access          Public
router.get('/:imageId', trackImageViews, async (req, res) => {
  const imageId = req.params.imageId;

  try {
    // Find the image using imageId
    const image = await Image.findById(imageId)
    .populate({
      path: 'user',
      select: 'name username profilePic'
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({ image });
  } catch (error) {
    console.error('Error fetching images: ', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
