const authenticate = require('../../Middlewares/Authenticate');
const CollectionImageRelation = require('../../Models/CollectionImageRelation');
const ImageCollection = require('../../Models/ImageCollection');
const router = require('express').Router()

//@description     Delete a collection
//@route           DELETE /api/collections/id
//@access          Protected
router.delete('/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const user = req.user.id;
  
  try {
       
    const deletedCollection = await ImageCollection.findOneAndDelete({_id: id, user});
    if(!deletedCollection) {
      return res.status(400).json({error: 'Unable to delete collection'})
    }

    // Delete all image docs in this collection 
    CollectionImageRelation.deleteMany({imageCollection: deletedCollection._id})
    
    res.status(200).json({message: 'Collection deleted', deletedCollection});
  } catch (error) {
    console.log('Error deleting collection: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;