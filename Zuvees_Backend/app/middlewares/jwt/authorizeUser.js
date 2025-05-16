const jwt = require("jsonwebtoken");

/*
 * Middleware factory to authorize users based on allowed roles.
 * Checks the JWT token from the Authorization header, verifies it,
 * and ensures the user has at least one of the allowed roles.
 *
 * @param {Array<string>} rolesAllowed - Array of roles permitted to access the route.
 * @returns {Function} Middleware function to enforce role-based access control.
 */

const authorizeUser = (rolesAllowed) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
      }

      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userRoles = decoded.roles;
      if (!Array.isArray(userRoles)) {
        return res.status(403).json({ message: "Invalid token roles format" });
      }
      
      const isAuthorized = userRoles.some(role => rolesAllowed.includes(role));
      if (!isAuthorized) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
  };
};

module.exports = { authorizeUser };
