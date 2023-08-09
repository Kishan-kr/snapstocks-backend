const { body, validationResult, check } = require('express-validator');
const fetchUserData = require('../../Middlewares/FetchUserData');
const Image = require('../../Models/Image');
const {uploadToCloudinary} = require('../../Middlewares/ConfigCloudinary');

const router = require('express').Router()

// Endpoint to Upload an image 
router.post('/', fetchUserData, [
  body('description', 'desribe your image').notEmpty(),
  // Validate the upload file 
  check('image').custom((value, { req }) => {
    if (!req.files || !req.files.image) {
      throw new Error('Please upload a file');
    }
    return true;
  })
], async (req, res) => {
  const userId = req.user.id;
  let success = false;

  // check for validation errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({success, error: errors.array()})
  }

  try {
    // upload the image to cloudinary 
    const cloudinaryResult = await uploadToCloudinary(req.files.image.data);

    // create new image document in DB 
    const image = {
      userId,
      publicId: cloudinaryResult.public_id,
      imageUrl: cloudinaryResult.secure_url,
      description: req.body.description,
      ...req.body
    }
    
   Image.create(image).then((uploadedImage) => {
    if(!uploadedImage) {
      return res.status(400).json({success, error: 'Error while uploading image'})
    }

    success = true;
    res.status(200).json({success, uploadedImage})
   }) 
  } catch (error) {
    console.error('Error uploading image: ', error)
    res.status(500).json({success, error: 'Error while uploading image'})
  }

})

module.exports = router;