const { deleteFromCloudinary } = require('../../Middlewares/ConfigCloudinary');
const fetchUserData = require('../../Middlewares/FetchUserData');
const Image = require('../../Models/Image');
const router = require('express').Router();

// Endpoint to Get images of a user with pagination
router.delete('/:id', fetchUserData, async (req, res) => {
  const id = req.params.id;
  let success = false;

  try {

    // Find and delete the image by id
    const deletedImage = await Image.findByIdAndDelete(id)

    if (!deletedImage) {
      return res.status(404).json({ success, error: 'Image not found' });
    }

    //Delete the above image from cloudinary also
    const publicId = deletedImage.publicId;
    const deleteResult = await deleteFromCloudinary(publicId);
    
    if (!deleteResult) {
      return res.status(404).json({ success, error: 'Image not found' });
    }

    // Delete all the objects of Like model associated with this image 
    

    success = true;
    res.status(200).json({ success, deletedImage });
    
  } catch (error) {
    console.error('Error deleting image: ', error);
    res.status(500).json({ success, error: 'Error while deleting image' });
  }
});

module.exports = router;
