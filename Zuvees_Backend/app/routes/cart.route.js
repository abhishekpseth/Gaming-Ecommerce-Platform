const express = require("express");

const router = express.Router();

const { addToCart, getCartItemsByUser, getCartSizeByUser, updateSizeInCartItem, updateQuantityInCartItem, deleteCartItem } = require("../controllers/cart.controller");

const { authenticateToken } = require("../middlewares/jwt/authenticateToken");

router.route("/").post(authenticateToken, addToCart);
router.route("/").delete(authenticateToken, deleteCartItem);
router.route("/").get(authenticateToken, getCartItemsByUser);
router.route("/cartSize").get(authenticateToken, getCartSizeByUser);
router.route("/cartSize").put(authenticateToken, updateSizeInCartItem);
router.route("/quantity").put(authenticateToken, updateQuantityInCartItem);

module.exports = router;