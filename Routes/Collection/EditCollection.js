const authenticate = require('../../Middlewares/Authenticate');
const ImageCollection = require('../../Models/ImageCollection');
const { body, validationResult } = require('express-validator');
const router = require('express').Router()

//@description     Edit collection (name, description, private)
//@route           PUT /api/collections/edit/id
//@access          Protected
router.put('/edit/:id', authenticate, [
  body('name').exists().withMessage("Collection name cannot be empty")
], async (req, res) => {
  const collectionId = req.params.id;
  const user = req.user.id;
  
  // return if validation errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()})
  }

  const update = {};

  if(req.body.name) {
    update.name = req.body.name;
  }
  if(req.body.description) {
    update.description = req.body.description;
  }
  if(req.body.private) {
    update.private = req.body.private;
  }

  try {
    const collection = await ImageCollection.findOneAndUpdate({
      _id: collectionId, user
    }, update, {new: true});

    // return error if unable to create the collection 
    if(!collection) {
      return res.status(400).json({error: 'Unable to update'})
    }

    res.status(200).json({message: 'Collection updated', collection});
  } catch (error) {
    console.log('Error updating collection: ', error);
    res.status(500).json({error: 'Server error'});
  }
})

module.exports = router;