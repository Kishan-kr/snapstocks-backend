const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    maxLength: 60,
    required: true
  },
  description: {
    type: String,
    default: '',
    maxLength: 250
  },
  private: {
    type: Boolean,
    default: false
  },
  imageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// text indexing with weights 
collectionSchema.index({
  name: 'text', description: 'text'
}, {weights: {
  name: 3,
  description: 2
}});

const ImageCollection = mongoose.model('ImageCollection', collectionSchema);

module.exports = ImageCollection;