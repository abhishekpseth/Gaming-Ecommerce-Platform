const Product = require("../models/product.model");
const WishList = require("../models/wishlist.model");

const CustomError = require("../utils/customError.utils");

const { fetchPublicURL } = require("../utils/cloudinary");

/*
 * Adds a product variant to the user's wishlist, or removes it if it already exists.
 *
 * @param {Object} req - The HTTP request object containing productID and variantID in the body.
 * @param {Object} res - The HTTP response object used to send the operation result.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the userID is missing.
 * @throws {Error} If an error occurs during the wishlist update operation.
 */

const addToWishlist = async (req, res, next) => {
  try {
    const userID = req?.user?._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required");
    }

    const { productID, variantID } = req.body;

    // Check if this item is already in the wishlist
    const existingItem = await WishList.findOne({ userID, productID, variantID });

    if (existingItem) {
      // If exists, remove from wishlist
      await WishList.findByIdAndDelete(existingItem._id);
      return res.status(200).json({ message: 'Product removed from wishlist.' });
    }

    // If not exists, add to wishlist
    const wishlistItem = new WishList({ userID, productID, variantID });
    await wishlistItem.save();

    return res.status(201).json({ message: 'Product added to wishlist.', data: wishlistItem });
  } catch (error) {
    next(error);
  }
};

/*
 * Removes a specific product variant from the user's wishlist.
 *
 * @param {Object} req - The HTTP request object containing productID and variantID in the body.
 * @param {Object} res - The HTTP response object used to send the removal result.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the userID is missing or the product is not found in the wishlist.
 * @throws {Error} If an error occurs during the removal operation.
 */

const removeFromWishlist = async (req, res, next) => {
  try {
    const userID = req?.user?._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required");
    }

    const { productID, variantID } = req.body;

    // Check if this item is already in the wishlist
    const existingItem = await WishList.findOne({ userID, productID, variantID });

    if (!existingItem) {
      throw new CustomError(400, "Product doesn't exists in wishlist");
    }

    await WishList.findByIdAndDelete(existingItem._id);
    return res.status(200).json({ message: 'Product removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves the detailed wishlist items for the authenticated user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send the wishlist data.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If there is an issue retrieving the wishlist or product details.
 */

const getWishlistByUser = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const wishlistItems = await WishList.find({ userID });

    if (!wishlistItems.length) {
      return res.status(200).json({ data: [] });
    }

    const detailedWishlist = [];

    for (const item of wishlistItems) {
      const product = await Product.findById(item.productID).lean();
      if (!product) continue;

      const variant = product.variants.find(
        v => v._id.toString() === item.variantID.toString()
      );
      if (!variant) continue;

      const availableSizes = variant.sizes
        ?.filter(sizeObj => sizeObj.stock > 0)
        .map(sizeObj => sizeObj.size) || [];

      const imageUrls = (variant.imageSrc || []).map(publicId =>
        fetchPublicURL(publicId)
      );

      detailedWishlist.push({
        productID: product._id,
        variantID: variant._id,
        name: product.name,
        brand: product.brand,
        color: variant.color,
        price: variant.price,
        imageSrc: imageUrls,
        description: variant.description,
        availableSizes
      });
    }

    return res.status(200).json({ data: detailedWishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser
}