const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Following = mongoose.model('Following', followingSchema);
module.exports = Following;
