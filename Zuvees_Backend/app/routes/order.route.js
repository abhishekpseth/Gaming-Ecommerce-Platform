const express = require("express");

const router = express.Router();

const { 
  createOrder, 
  getAllOrders, 
  updateStatus,
  getOrdersDetails,
  getProductDetailsOfOrder,
  updateRider, 
} = require("../controllers/order.controller");

const { authenticateToken } = require("../middlewares/jwt/authenticateToken");
const { authorizeUser } = require("../middlewares/jwt/authorizeUser");

router.route("/").post(authenticateToken, createOrder);
router.route("/").get(authenticateToken, authorizeUser(["admin"]), getAllOrders);
router.route("/ordersDetails").get(authenticateToken, getOrdersDetails);
router.route("/productDetailsOfOrder").get(authenticateToken, getProductDetailsOfOrder);
router.route("/rider").put(authenticateToken, authorizeUser(["admin"]) ,updateRider);
router.route("/status").put(authenticateToken, authorizeUser(["admin", "rider"]), updateStatus);

module.exports = router;