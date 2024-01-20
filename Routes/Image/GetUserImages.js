const Image = require('../../Models/Image');
const router = require('express').Router();

//@description     Get images of a user with pagination
//@route           GET /api/images/users/userid
//@access          Public
router.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const itemsPerPage = req.query.items; // Number of images to show per page
  const page = req.query.page || 1; // Get the requested page from the query parameters
  
  try {
    // Calculate the number of images to skip based on the requested page
    const skipCount = Number(page - 1) * Number(itemsPerPage);

    // Find images of a user in DB with pagination
    const images = await Image.find({ user: userId })
      .sort({createdAt: -1})
      .skip(skipCount)
      .limit(itemsPerPage)

    if (!images || images.length <= 0) {
      return res.status(200).json({ message: 'No image found', images });
    }

    res.status(200).json({ images });
  } catch (error) {
    console.error('Error fetching images: ', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
