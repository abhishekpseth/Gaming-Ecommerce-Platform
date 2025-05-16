const express = require("express");

const cart_routes = require("./cart.route");
const order_routes = require("./order.route");
const rider_routes = require("./rider.route");
const login_routes = require("./login.route");
const product_routes = require("./product.route");
const wishlist_routes = require("./wishlist.route");
const user_routes = require("./user.route");

const router = express.Router();

router.use("/cart", cart_routes);
router.use("/order", order_routes);
router.use("/rider", rider_routes);
router.use("/login", login_routes);
router.use("/product", product_routes);
router.use("/wishlist", wishlist_routes);
router.use("/user", user_routes);

module.exports = router;
