// routes/imageRoutes.js
const express = require('express');
const { downloadLimiter, trackDownload } = require('../../Middlewares/DownloadMiddleware');
const Image = require('../../Models/Image');
const fetch = require('node-fetch') // Import the 'node-fetch' library
const DownloadHistory = require('../../Models/DownloadHistory');
const router = express.Router();


//@description     Download an image
//@route           GET /api/images/imageid/download
//@access          Public
router.get('/:id/download', downloadLimiter, trackDownload, async (req, res) => {
  const userId = req.body?.userId || null;

  try {
    // Retrieve the image by ID
    const image = await Image.findById(req.params.id).populate({path: 'user', select: 'username'});
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get the desired image size from the query parameter (e.g., 'small', 'medium', 'large')
    const desiredWidth = req.query.w || 'original';

    // Determine the Cloudinary transformation options based on the desired size
    let transformation = {};
    const originalHeight = image.height;
    const originalWidth = image.width;

    if (desiredWidth === '640') {
      transformation = { width: 640, height: originalHeight/(originalWidth/640), crop: 'fill' };
    } else if (desiredWidth === '1920') {
      transformation = { width: 1920, height: originalHeight/(originalWidth/1920), crop: 'fill' };
    } else if (desiredWidth === '2400') {
      transformation = { width: 2400, height: originalHeight/(originalWidth/2400), crop: 'fill' };
    }

    // Construct the Cloudinary image URL with the transformation options
    const imageUrl = cloudinary.url(image.publicId, {
      ...transformation,
      secure: true, // Ensure the URL is HTTPS
    });

    // Fetch the image data from the Cloudinary URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Error fetching image');
    }

    // Get the image data and content type from the response
    const imageData = await response.buffer();
    const contentType = response.headers.get('content-type');

    // Set the appropriate headers for the download
    const filename = `${image.user.username}-${image.publicId}-snapstock`
    res.set({
      // 'Content-Disposition': `attachment; filename=${image.user.username}-${image.publicId}-snapstock`, // Set desired filename
      'Content-Disposition': `attachment; filename=${filename}`, // Set desired filename
      'Content-Type': contentType,
    });

    // increment download count of image 
    image.downloads += 1;
    image.save();

    // add to download history if userId available 
    if(userId !== null && userId.length > 0) {
      DownloadHistory.create({
        user: userId,
        image: image._id
      })
    }

    // Send the image data for download
    res.send(imageData);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Error downloading image' });
  }
});

module.exports = router;
