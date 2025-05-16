const express = require("express");

const router = express.Router();

const { getRiders, getOrdersByRider } = require("../controllers/rider.controller");

const { authenticateToken } = require("../middlewares/jwt/authenticateToken");
const { authorizeUser } = require("../middlewares/jwt/authorizeUser");

router.route("/").get(authenticateToken, getRiders);
router.route("/ordersByRider").get(authenticateToken, authorizeUser(["rider"]), getOrdersByRider);

module.exports = router;