const { ObjectId } = require('bson');
const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publicId : String,
  imageUrl : String,
  description : String,
  location : String,
  likes : mongoose.Types.Decimal128,
  views : mongoose.Types.Decimal128,
  downloads : mongoose.Types.Decimal128,
  tags : String,
  
  date : {
    type : Date,
    default : Date.now()
  },
})

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;