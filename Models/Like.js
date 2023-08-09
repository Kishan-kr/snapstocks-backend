const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
