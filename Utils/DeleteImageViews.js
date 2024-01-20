const ImageView = require("../Models/ImageView");

async function deleteImageViews(imageId) {
  const deletedViews = await ImageView.deleteMany({imageId});
  if(deletedViews) {
    console.log('Deleted Views: ', deletedViews.deletedCount);
  }
}

module.exports = deleteImageViews;