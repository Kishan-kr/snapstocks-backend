const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Search collections
//@route           GET /api/collections/search
//@access          Public
router.get('/search', async (req, res) => {
  const keywords = req.query.keywords;
  const page = Number(req.query.page) || 1;
  const items = Number(req.query.items) || 10;
  const skipCount = (page - 1) * items;
  
  // aggregation pipeline to query collections 
  const pipeline = [{
    $match: {
      $text: {
        $search: keywords
      },
      private: false
    }
  }, { 
    $sort: { 
      score: { 
        $meta: "textScore" 
      } 
    } 
  }, {
    $skip: skipCount
  }, {
    $limit: items
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
  }]
  
  try {
    const collections = await ImageCollection.aggregate(pipeline);
    
    res.status(200).json({collections});
  } catch (error) {
    console.log('Error searching collections: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;