const Image = require('../../Models/Image');
const router = require('express').Router();

// Endpoint to Get images of a user with pagination
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const itemsPerPage = req.query.items; // Number of images to show per page
  const page = req.query.page || 1; // Get the requested page from the query parameters
  let success = false;

  try {
    // Calculate the number of images to skip based on the requested page
    const skipCount = (page - 1) * itemsPerPage;

    // Find images of a user in DB with pagination
    const images = await Image.find({ userId }).skip(skipCount).limit(itemsPerPage)

    if (!images || images.length <= 0) {
      return res.status(404).json({ success, error: 'Images not found' });
    }

    success = true;
    res.status(200).json({ success, images });
  } catch (error) {
    console.error('Error fetching images: ', error);
    res.status(500).json({ success, error: 'Error while fetching images of a user' });
  }
});

module.exports = router;
