const authenticate = require('../../Middlewares/Authenticate');
const Image = require('../../Models/Image');

const router = require('express').Router()

//@description     Update an image
//@route           PUT /api/images/imageid
//@access          Protected
router.put('/:id', authenticate, async (req, res) => {
  const user = req.user.id;
  const id = req.params.id;

  try {
    // Find the image in DB 
    const image = await Image.findOne({id, user});

    if(!image) {
      return res.status(404).json({ error: 'Image not found'})
    }
    
    // Update the desired fields based on req.body
    if (req.body.description) {
      image.description = req.body.description;
    }
    if (req.body.location) {
      image.location = req.body.location;
    }
    if (req.body.tags) {
      image.tags = req.body.tags;
    }
    
    await image.save();
    res.status(200).json({message: 'Image updated', image})

  } catch (error) {
    console.error('Error updating image: ', error)
    res.status(500).json({ error: 'Server error'})
  }

})

module.exports = router;