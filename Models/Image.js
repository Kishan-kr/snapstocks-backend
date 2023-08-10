const { ObjectId } = require('bson');
const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publicId : {type: String, required: true},
  imageUrl : {type: String, required: true},
  description : {type: String, required: true},
  height: Number,
  width: Number,
  location : String,
  likes : {type: Number, default: 0},
  views : {type: Number, default: 0},
  downloads : {type: Number, default: 0},
  tags : [String],
  
  date : {
    type : Date,
    default : Date.now()
  },
})

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;