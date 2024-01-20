const Image = require('../../Models/Image');

const router = require('express').Router();

//@description     Get count of images 
//@route           GET /api/images/count
//@access          Public
router.get('/count', async (req, res) => {
  // count images by user if userId available 
  if(req.body.userId) {
    const userId = req.body.userId;
    const count = await Image.countDocuments({user: userId});
    return res.status(200).send(count);
  }

  // count queried images 
  const keywords = req.query.keywords || '';

  const query = {
    $match: { $text: { $search: keywords } }
  }

  // Check if the dimension filter is provided in the request
  if (req.query.dimension) {
    const dimensionFilter = req.query.dimension;

    if (dimensionFilter === 'landscape') {
      // Filter for landscape images (width > height)
      query.$match.width = { $gt: "$height" };
    } else if (dimensionFilter === 'portrait') {
      // Filter for portrait images (height > width)
      query.$match.height = { $gt: "$width" };
    }
    // For 'all', no additional filtering is applied
  }

  try {
    // count the no of images by passing query
    const count = await Image.countDocuments(query);

    res.status(200).send(count);

  } catch (error) {
    console.error('Error counting images: ', error);
    res.status(500).json({ 'error': 'Server error' });
  }
})

module.exports = router;