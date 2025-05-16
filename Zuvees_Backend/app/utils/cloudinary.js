const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch Public URL of a media stored on cloudinary
const fetchPublicURL = (publicId) => {
  if (!publicId) {
    console.error("publicId is required to fetch the image.");
    return null;
  }

  const imageUrl = cloudinary.url(publicId, {
    secure: true,
    resource_type: "image",
  });

  return imageUrl;
};

// Upload image on cloudinary using URL from another source (google / amazon)
const uploadOnCloudinaryUsingRemoteURL = async (file, folder) => {
  try {
    if (!file) return null;

    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: folder,
    });

    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

module.exports = { 
  fetchPublicURL,
  uploadOnCloudinaryUsingRemoteURL
};
