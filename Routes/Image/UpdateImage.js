const fetchUserData = require('../../Middlewares/FetchUserData');
const Image = require('../../Models/Image');

const router = require('express').Router()

// Endpoint to Upload an image 
router.put('/:id', fetchUserData, async (req, res) => {
  const id = req.params.id;
  let success = false;

  try {
    // Find the image in DB 
    const image = await Image.findById(id);

    if(!image) {
      return res.status(400).json({success, error: 'Image not found!'})
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
    success = true;
    res.status(200).json({success, image})

  } catch (error) {
    console.error('Error updating image: ', error)
    res.status(500).json({success, error: 'Error while updating image'})
  }

})

module.exports = router;