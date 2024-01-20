const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Get all collections of a user
//@route           GET /api/collections/users/userid
//@access          Public
router.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const clientUserId = req.body?.userId || null;
  
  try {
    // Private collections can only be accessed by their owner
    if(clientUserId && clientUserId === userId) {
      const collections = await ImageCollection.find({user: userId});
      const count = collections?.length;
      return res.status(200).json({collections, count});
    }
    
    const collections = await ImageCollection.find({user: userId, private: false});
    const count = collections.length;
    res.status(200).json({collections, count});
  } catch (error) {
    console.log('Error fetching collections: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;