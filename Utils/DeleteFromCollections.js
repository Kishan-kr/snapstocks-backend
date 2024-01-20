const CollectionImageRelation = require('../Models/CollectionImageRelation')
const ImageCollection = require('../Models/ImageCollection')

async function deleteFromCollections(imageId) {
  try {
    const deletedRelations = await CollectionImageRelation.find({ image: imageId });

    // Decrement the imageCount in Collection model for collections containing the deleted image
    if (deletedRelations.length > 0) {
      // Create an array of collection IDs from the deleted relationships
      const collectionIds = deletedRelations.map((rel) => rel.collection);

      // Delete the relationships
      await CollectionImageRelation.deleteMany({ image: imageId });

      // Decrement the imageCount in collections
      await ImageCollection.updateMany(
        { _id: { $in: collectionIds } },
        { $inc: { imageCount: -1 } }
      );
    }
  } catch (error) {
    console.error('Error deleting images from collections: ', error);
  }
}

module.exports = deleteFromCollections;