const authenticate = require('../../Middlewares/Authenticate');
const CollectionImageRelation = require('../../Models/CollectionImageRelation');
const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Update collection (add or remove images)
//@route           PUT /api/collections/
//@access          Protected
router.put('/', authenticate, async (req, res) => {
  const collection = req.body.collection;
  const image = req.body.image;
  const action = Number(req.query.action) // 1 to add ; 0 to remove
  
  try {
    // Add image to collection if not already 
    if(action === 1){
      const imageExist = await CollectionImageRelation.findOne({
        imageCollection: collection,
        image
      })

      if(imageExist) {
        return res.status(200).json({message: 'Image added', image: imageExist})
      }

      const addedImage = await CollectionImageRelation.create({
        imageCollection: collection,
        image
      })

      if(!addedImage) {
        return res.status(400).json({error: 'Unable to add the image'})
      }

      // increment imageCount of the collection 
      ImageCollection.findByIdAndUpdate(collection, {$inc: {imageCount: 1}});

      return res.status(200).json({message: 'Image added', image: addedImage})
    }

    // Remove image from collection
    else {
      const removedImage = CollectionImageRelation.findOneAndDelete({
        imageCollection: collection,
        image
      });

      if(!removedImage) {
        return res.status(400).json({error: 'Unable to remove from collection'});
      }

      // decrement imageCount of the collection 
      ImageCollection.findByIdAndUpdate(collection, {$inc: {imageCount: -1}});

      return res.status(200).json({message: 'Image removed', image: removedImage})
    }
    
  } catch (error) {
    console.log('Error updating collection: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;