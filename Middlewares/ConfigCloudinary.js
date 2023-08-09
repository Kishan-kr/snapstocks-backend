const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// function to upload image to cloudinary 
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image' // Specify the resource type (e.g., 'image', 'video', 'raw')
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to cloudinary:', error);
          reject('Error uploading image to cloudinary');
        } else {
          resolve(result);
        }
      }
    );

    // Pass the buffer directly to uploadStream
    uploadStream.write(buffer);
    uploadStream.end();
  });
}


// function to delete image from cloudinary 
const deleteFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.error('Error deleting image from cloudinary:', error);
        reject('Error deleting image from cloudinary');
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {uploadToCloudinary, deleteFromCloudinary};