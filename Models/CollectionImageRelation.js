const mongoose = require('mongoose')

const collectionImageRelationSchema = new mongoose.Schema({
  imageCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageCollection',
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const CollectionImageRelation = mongoose.model('CollectionImageRelation', collectionImageRelationSchema);

module.exports = CollectionImageRelation;