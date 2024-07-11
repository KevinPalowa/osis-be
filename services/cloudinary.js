const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    fs.unlinkSync(imagePath);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error.message);
    throw error;
  }
};

module.exports = {
  uploadImageToCloudinary,
};
