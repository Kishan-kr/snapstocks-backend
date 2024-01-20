const Image = require('../../Models/Image');
const router = require('express').Router();
const { sortMap } = require('../../Utils/Maps')

//@description     Get images 
//@route           GET /api/images/
//@access          Public
router.get('/', async (req, res) => {
  const itemsPerPage = req.query.items || 10; // Number of images to show per page
  const page = req.query.page || 1; // Get the requested page from the query parameters
  const keywords = req.query.keywords || '';
  const orderBy = req.query.order_by || 'newest';

  try {
    // Calculate the number of images to skip based on the requested page
    const skipCount = Number(page - 1) * Number(itemsPerPage);

    // aggregation pipeline to query for images
    const pipeline = [{
      $match: {
        $text: {
          $search: keywords
        }
      }
    }, {
      $sort: sortMap.get(orderBy)
    }, {
      $skip: skipCount
    }, {
      $limit: itemsPerPage
    }, {
      $lookup: {
        from: "User",
        localField: "user",
        foreignField: "_id",
        pipeline: [{
          $project: { name: 1, hireable: 1, profilePic: 1 }
        }],
        as: "user"
      }
    }];

    // Check if the dimension filter is provided in the request
    if (req.query.dimension) {
      const dimensionFilter = req.query.dimension;

      if (dimensionFilter === 'landscape') {
        // Filter for landscape images (width > height)
        pipeline[0].$match.width = { $gt: "$height" };
      } else if (dimensionFilter === 'portrait') {
        // Filter for portrait images (height > width)
        pipeline[0].$match.height = { $gt: "$width" };
      }
      // For 'all', no additional filtering is applied
    }

    // apply aggregation to find images 
    const images = await Image.aggregate(pipeline);

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
