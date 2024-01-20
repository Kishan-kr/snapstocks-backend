const mongoose = require('mongoose')

const downloadHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const DownloadHistory = mongoose.model('DownloadHistory', downloadHistorySchema);

module.exports = DownloadHistory;