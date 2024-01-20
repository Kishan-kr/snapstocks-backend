const Image = require("../Models/Image");
const ImageView = require("../Models/ImageView");

async function trackImageViews (req, res, next) {
  const imageId = req.params.imageId;

  // Check if the user is authenticated
  if (req.body.userId) {
    const userId = req.body.userId;

    // check if user has already viewed this image 
    const isViewed = await ImageView.findOne({ imageId, userId });

    // if not create new ImageView doc and inc views
    if(!isViewed) {
      await ImageView.create({
        imageId,
        userId,
        timestamp: new Date()
      })

      // increment view count of image by one 
      await Image.findByIdAndUpdate(imageId, {$inc: {views: 1}}, {new: true});
    }
  } else {
    const userIP = req.ip;

    // check if already viewed using ip address
    const lastView = await ImageView.findOne({
      imageId,
      ip: userIP,
      timestamp: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) } // Within the last 24 hours
    });

    // if not, create new ImageView doc and inc view count 
    if (!lastView) {
      await ImageView.create({
        imageId,
        ip: userIP,
        timestamp: new Date()
      })

      // increment view count of image by one 
      await Image.findByIdAndUpdate(imageId, {$inc: {views: 1}}, {new: true});
    }
  }

  next();
};

module.exports = trackImageViews;