const express = require("express");

const router = express.Router();

const { getWishlistByUser, addToWishlist, removeFromWishlist } = require("../controllers/wishlist.controller");

const { authenticateToken } = require("../middlewares/jwt/authenticateToken");

router.route("/").post(authenticateToken, addToWishlist);
router.route("/").get(authenticateToken, getWishlistByUser);
router.route("/remove").post(authenticateToken, removeFromWishlist);

module.exports = router;