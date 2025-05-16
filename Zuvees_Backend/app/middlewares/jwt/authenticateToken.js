require("dotenv").config();
const jwt = require("jsonwebtoken");

/*
 * Middleware to authenticate JWT tokens from the Authorization header.
 * Verifies the token and attaches the decoded user to the request object.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send unauthorized or forbidden responses.
 * @param {Function} next - The next middleware function.
 */

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
