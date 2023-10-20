const mongoose = require('mongoose');

const userImageLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }
});

const UserImageLike = mongoose.model('UserImageLike', userImageLikeSchema);
module.exports = UserImageLike;
