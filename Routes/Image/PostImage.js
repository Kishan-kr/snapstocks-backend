const { body, validationResult, check } = require('express-validator');
const Image = require('../../Models/Image');
const {uploadToCloudinary} = require('../../Utils/ConfigCloudinary');
const authenticate = require('../../Middlewares/Authenticate');

const router = require('express').Router()

//@description     Upload an image
//@route           POST /api/images/
//@access          Protected
router.post('/', authenticate, [
  body('tags', 'Add alteast one tag').notEmpty(),
  // Validate the upload file 
  check('image').custom((value, { req }) => {
    if (!req.files || !req.files.image) {
      throw new Error('Please upload an image');
    }
    return true;
  })
], async (req, res) => {
  const userId = req.user.id;

  // check for validation errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()})
  }

  try {
    // upload the image to cloudinary 
    const cloudinaryResult = await uploadToCloudinary(req.files.image.data);
    const { public_id, secure_url, width, height } = cloudinaryResult;
    
    // create new image document in DB 
    const image = {
      user: userId,
      publicId: public_id,
      imageUrl: secure_url,
      description: req.body.description,
      width,
      height,
      ...req.body
    }
    
   Image.create(image).then((uploadedImage) => {
    if(!uploadedImage) {
      return res.status(400).json({ error: 'Unable to upload'})
    }

    res.status(200).json({message: 'Image uploaded', uploadedImage})
   }) 
  } catch (error) {
    console.error('Error uploading image: ', error)
    res.status(500).json({ error: 'Server error'})
  }

})

module.exports = router;