// middleware/downloadMiddleware.js
const rateLimit = require('express-rate-limit');
const Image = require('../Models/Image');

// Rate limiting: Limit requests from same IP address
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Allow only 2 requests per windowMs
});

// Downloads count tracking middleware
const trackDownload = async (req, res, next) => {
  try {
    // Find the image by ID
    const image = await Image.findById(req.params.id);

    // Update download count
    image.downloads += 1;
    await image.save();

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ error: 'Error tracking download' });
  }
};

module.exports = { downloadLimiter, trackDownload };
