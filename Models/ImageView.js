const mongoose = require('mongoose')

const imageViewSchema = new mongoose.Schema({
  imageId: String,
  ip: String,
  userId: String,
  timestamp: { type: Date, default: Date.now },
});

const ImageView = mongoose.model('ImageView', imageViewSchema);
module.exports = ImageView;