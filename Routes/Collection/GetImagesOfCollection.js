const CollectionImageRelation = require('../../Models/CollectionImageRelation');
const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Get images of a collection
//@route           GET /api/collections/id/images
//@access          Public
router.get('/:id/images', async (req, res) => {
  const collectionId = req.params.id
  const items = Number(req.params.items) || 10;
  const page = Number(req.params.page )|| 1;
  const skipCount = (page - 1) * items;

  try {
    const images = await CollectionImageRelation.find({
      imageCollection: collectionId
    }).sort({createdAt: -1})
    .skip(skipCount)
    .limit(items)
    .populate('image');

    res.status(200).json({message: 'Images found', images});
  } catch (error) {
    console.log('Error fetching collection images: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;