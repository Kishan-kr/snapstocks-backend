const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Get collection by id
//@route           GET /api/collections/id
//@access          Public
router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const collection = await ImageCollection.findById(id);

    if(!collection) {
      return res.status(400).json({error: 'Collection not found'});
    }

    // Private collection can only be accessed by its owner 
    if(collection.private && collection.user !== req.body?.userId) {
      return res.status(401).json({error: 'Access denied'})
    }

    res.status(200).json({message: 'Collection found', collection});
  } catch (error) {
    console.log('Error fetching collection: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;