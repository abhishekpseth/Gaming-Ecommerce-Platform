const express = require("express");

const router = express.Router();

const { addProducts, getProducts, getProductVariantDetails, getAllFiltersDropdown } = require("../controllers/product.controller");

router.route("/").get(getProducts);
router.route("/").post(addProducts);
router.route("/variant").get(getProductVariantDetails);
router.route("/filtersDropdown").get(getAllFiltersDropdown);

module.exports = router;