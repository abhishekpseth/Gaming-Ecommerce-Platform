const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const WishList = require("../models/wishlist.model");

const CustomError = require("../utils/customError.utils");

const { fetchPublicURL } = require("../utils/cloudinary");

/*
 * Adds a product variant to the user's cart or updates the quantity if it already exists.
 * Optionally removes the item from the wishlist if specified.
 * Utilizes MongoDB transactions to ensure atomic operations.
 *
 * @param {Object} req - The HTTP request object, containing user info and cart item data.
 * @param {Object} res - The HTTP response object used to send the cart update status.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If any required field is missing or wishlist item is not found when attempting to remove.
 * @throws {Error} If any error occurs during the database transaction.
 */

const addToCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userID = req.user._id;
    const { productID, variantID, size, removeFromWishlist = false } = req.body;

   if (!userID || !productID || !variantID || !size) {
      throw new CustomError(400, "All fields are required.");
    }

    const existingCartItem = await Cart.findOne({
      userID,
      productID,
      variantID,
      size
    }).session(session);

    let cartItem;

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      cartItem = await existingCartItem.save({ session });
    } else {
      const newCartItem = new Cart({
        userID,
        productID,
        variantID,
        size,
        quantity: 1,
      });
      cartItem = await newCartItem.save({ session });
    }

    if (removeFromWishlist) {
      const existingWishlistItem = await WishList.findOne({
        userID,
        productID,
        variantID
      }).session(session);

      if (!existingWishlistItem) {
        throw new CustomError(400, "Product doesn't exist in wishlist");
      }

      await WishList.findByIdAndDelete(existingWishlistItem._id).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    if(existingCartItem){
      return res.status(200).json({
        message: "Item quantity updated in cart",
        cartItem
      });
    }

    return res.status(201).json({
      message: "Item added to cart successfully",
      cartItem
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/*
 * Retrieves all cart items for the authenticated user and enriches them with product and variant details.
 * Filters out any items with missing product or variant data before sending the response.
 *
 * @param {Object} req - The HTTP request object containing the authenticated user's information.
 * @param {Object} res - The HTTP response object used to send the enriched cart items data.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the user ID is missing in the request.
 * @throws {Error} If an error occurs while fetching or processing cart items.
 */

const getCartItemsByUser = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required.");
    }

    const cartItems = await Cart.find({ userID });

    const enrichedCartItems = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productID);
      if (!product) return null;

      const variant = product.variants.id(item.variantID);
      if (!variant) return null;

      const selectedSizeObj = variant.sizes.find(s => s.size === item.size);
      const availableSizes = variant.sizes.map(sizeObj => sizeObj.size);

      const imageUrls = (variant.imageSrc || []).map(publicId =>
        fetchPublicURL(publicId)
      );

      return {
        cartID: item._id,
        productID: item.productID,
        variantID: item.variantID,
        size: item.size,
        quantity: item.quantity,
        productName: product.name,
        brand: product.brand,
        price: variant.price,
        color: variant.color,
        images: imageUrls,
        stockSize: selectedSizeObj?.stock || 0,
        availableSizes,
      };
    }));

    const filteredItems = enrichedCartItems.filter(item => item !== null);

    return res.status(200).json({
      message: "Cart items fetched successfully",
      cartItems: filteredItems
    });

  } catch (error) {
    next(error);
  }
};

/*
 * Calculates the total quantity of valid items in the authenticated user's cart.
 * Only includes items with existing product, variant, and size data.
 *
 * @param {Object} req - The HTTP request object containing the authenticated user's information.
 * @param {Object} res - The HTTP response object used to send the total cart size.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the user ID is missing in the request.
 * @throws {Error} If an error occurs while fetching or processing cart data.
 */

const getCartSizeByUser = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required.");
    }

    const cartItems = await Cart.find({ userID });

    const enrichedCartItems = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productID);
      if (!product) return null;

      const variant = product.variants.id(item.variantID);
      if (!variant) return null;

      const selectedSizeObj = variant.sizes.find(s => s.size === item.size);
      if (!selectedSizeObj) return null;

      return item.quantity;
    }));

    const validQuantities = enrichedCartItems.filter(qty => qty !== null);
    const cartSize = validQuantities.reduce((total, qty) => total + qty, 0);

    return res.status(200).json({
      message: "Cart size fetched successfully",
      cartSize
    });

  } catch (error) {
    next(error);
  }
};

/*
 * Updates the size of a specific cart item for the authenticated user.
 * Ensures that the cart item belongs to the user before performing the update.
 *
 * @param {Object} req - The HTTP request object containing the user's ID and size update details.
 * @param {Object} res - The HTTP response object used to send the updated cart item.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If an error occurs during the update process.
 */

const updateSizeInCartItem = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { cartID, newSize } = req.body;

    if (!cartID || !newSize) {
      return res.status(400).json({ message: "cartID and newSize are required." });
    }

    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: cartID, userID },
      { size: newSize },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Cart item size updated successfully",
      cartItem: updatedCartItem
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Updates the quantity of a specific cart item for the authenticated user.
 * Validates the input to ensure the quantity is a positive number and the item belongs to the user.
 *
 * @param {Object} req - The HTTP request object containing the user's ID and quantity update details.
 * @param {Object} res - The HTTP response object used to send the updated cart item.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If an error occurs during the update process.
 */

const updateQuantityInCartItem = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { cartID, newQuantity } = req.body;

    if (!cartID || typeof newQuantity !== 'number' || newQuantity < 1) {
      return res.status(400).json({ message: "cartID and valid newQuantity are required." });
    }

    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: cartID, userID },
      { quantity: newQuantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Cart item quantity updated successfully",
      cartItem: updatedCartItem
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Deletes a specific cart item for the authenticated user.
 * Ensures the item exists and belongs to the user before deletion.
 *
 * @param {Object} req - The HTTP request object containing the user's ID and cart item ID in the query.
 * @param {Object} res - The HTTP response object used to send the deletion result.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If an error occurs during the deletion process.
 */

const deleteCartItem = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { cartID } = req.query;

    if (!cartID) {
      return res.status(400).json({ message: "cartID is required." });
    }

    const deletedItem = await Cart.findOneAndDelete({ _id: cartID, userID });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Cart item deleted successfully",
      deletedCartItem: deletedItem
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCartItemsByUser,
  getCartSizeByUser,
  updateSizeInCartItem,
  updateQuantityInCartItem,
  deleteCartItem
};