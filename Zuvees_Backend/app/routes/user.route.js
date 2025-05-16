const express = require("express");

const router = express.Router();

const { getAllAddresses, addAddress, deleteAddress } = require("../controllers/user.controller");

const { authenticateToken } = require("../middlewares/jwt/authenticateToken");

router.route("/addresses").get(authenticateToken, getAllAddresses);
router.route("/address").post(authenticateToken, addAddress);
router.route("/deleteAddress").post(authenticateToken, deleteAddress);

module.exports = router;