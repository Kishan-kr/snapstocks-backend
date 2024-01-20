const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Search collections
//@route           GET /api/collections/search/count
//@access          Public
router.get('/search/count', async (req, res) => {
  const keywords = req.query.keywords;
  
  // query 
  const query = {
    $match: {
      $text: {
        $search: keywords
      },
      private: false
    }
  }
  
  try {
    const count = await ImageCollection.countDocuments(query);
    
    res.status(200).json({count});
  } catch (error) {
    console.log('Error counting collections: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;