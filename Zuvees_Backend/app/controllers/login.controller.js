const axios = require("axios");
const jwt = require("jsonwebtoken");

const ApprovedEmail = require("../models/approvedEmail.model");

const { oauth2Client } = require("../utils/googleClient");
const { fetchPublicURL, uploadOnCloudinaryUsingRemoteURL } = require("../utils/cloudinary");

/*
 * Handles user login using Google OAuth. Retrieves user information from Google,
 * uploads the user's profile picture to Cloudinary if needed, and issues a JWT token.
 * Creates a new user entry if the email is not already approved in the system.
 *
 * @param {Object} req - The HTTP request object containing the Google authorization code in the body.
 * @param {Object} res - The HTTP response object used to send the authentication result and token.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If the OAuth flow fails, user info cannot be retrieved, or any other error occurs during authentication.
 */

const login = async (req, res, next) => {
  const { googleCode } = req.body;

  try {
    const googleRes = await oauth2Client.getToken(googleCode);

    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    
    const { email, name, picture } = userRes.data;
    
    let profileImagePublicURL;

    let user = await ApprovedEmail.findOne({ email });

    if (!user) {
      const uploadImgResult = await uploadOnCloudinaryUsingRemoteURL(picture, "gamingEcommerce/usersImage");

      const cloudinaryPublicID = uploadImgResult?.public_id;

      profileImagePublicURL = uploadImgResult?.secure_url; 

      user = await ApprovedEmail.create({
        name,
        email,
        imageSrc: cloudinaryPublicID,
        roles: ["user"],
      });
    }else if(!user.imageSrc){
      const uploadImgResult = await uploadOnCloudinaryUsingRemoteURL(picture, "gamingEcommerce/usersImage");

      const cloudinaryPublicID = uploadImgResult?.public_id;

      user.imageSrc = cloudinaryPublicID;
      await user.save();

      profileImagePublicURL = uploadImgResult?.secure_url; 
    }else{
      const cloudinaryPublicID = user?.imageSrc;

      profileImagePublicURL = fetchPublicURL(cloudinaryPublicID);
    }

    const { _id } = user;

    const expiresIn = process.env.JWT_TIMEOUT || "12h";
    const token = jwt.sign({ _id, email, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn,
    });

    res.status(200).json({
      message: "success",
      token,
      user,
      profileImgURL: profileImagePublicURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
