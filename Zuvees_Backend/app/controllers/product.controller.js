const Product = require("../models/product.model");
const WishList = require("../models/wishlist.model");

const CustomError = require("../utils/customError.utils");

const { fetchPublicURL } = require("../utils/cloudinary");

/*
 * Replaces all existing products by deleting them and inserting a new batch of products.
 *
 * @param {Object} req - The HTTP request object containing an array of products in the body.
 * @param {Object} res - The HTTP response object used to send confirmation and inserted product data.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If an error occurs during deletion or insertion of products.
 */

const addProducts = async(req, res, next)=>{
  try {
    const { products } = req.body;

    await Product.deleteMany(); 
    const inserted = await Product.insertMany(products);
    res.status(201).json({
      message: 'Products added successfully',
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    next(error);
  }
}

/*
 * Retrieves products from the database based on optional search, color, size filters, and sorting preferences.
 * Supports pagination and enriches product variants with image URLs and wishlist status for the specified user.
 *
 * @param {Object} req - The HTTP request object containing query parameters:
 *   - userID {string} (optional): ID of the user to fetch wishlist info.
 *   - searchInput {string} (optional): Text to search product name, brand, or description.
 *   - selectedColors {string} (optional): Comma-separated list of colors to filter variants.
 *   - selectedSizes {string} (optional): Comma-separated list of sizes to filter variants.
 *   - selectedSortingOptionID {string} (optional): Sorting option ID ('priceAsc', 'priceDesc', 'creationDateDesc').
 *   - page {string|number} (optional): Page number for pagination.
 *   - limit {string|number} (optional): Number of products per page.
 * @param {Object} res - The HTTP response object used to send back the filtered, sorted, and paginated product list.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If there is an issue querying the products or processing data.
 */

const getProducts = async (req, res, next) => {
  try {
    const { userID, searchInput, page, limit } = req.query;

    const selectedColors = req.query.selectedColors?.split(',') || [""];
    const selectedSizes = req.query.selectedSizes?.split(',') || [""];
    
    const selectedSortingOptionID = req.query.selectedSortingOptionID || "creationDateDesc";

    const query = {};
    if (searchInput && searchInput?.trim()) {
      const searchRegex = { $regex: searchInput, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ];
    }

    const allProducts = await Product.find(query);

    let wishlistItems = [];
    if (userID) {
      wishlistItems = await WishList.find({ userID }).lean();
    }

    const result = [];

    for (const product of allProducts) {
      const { variants, ...rest } = product.toObject();

      const filteredVariants = variants.filter(variant => {
        const matchesColor =
          (selectedColors.length === 1 && selectedColors[0] === '') ||
          selectedColors.includes(variant.color);

        const availableSizes = variant.sizes
          ?.filter(sizeObj => sizeObj.stock > 0)
          .map(sizeObj => sizeObj.size) || [];

        const matchesSize =
          (selectedSizes.length === 1 && selectedSizes[0] === '') ||
          availableSizes.some(size => selectedSizes.includes(size));

        return matchesColor && matchesSize;
      });

      if (filteredVariants.length === 0) continue;

      filteredVariants.forEach(variant => {
        const availableSizes = variant.sizes
          ?.filter(sizeObj => sizeObj.stock > 0)
          .map(sizeObj => sizeObj.size) || [];

        const imageUrls = (variant.imageSrc || []).map(publicId =>
          fetchPublicURL(publicId)
        );

        const isWishlisted = userID
          ? wishlistItems.some(
              item =>
                item.productID?.toString() === product._id.toString() &&
                item.variantID?.toString() === variant._id.toString()
            )
          : undefined;

        const productEntry = {
          ...rest,
          ...variant,
          imageSrc: imageUrls, 
          availableSizes,
          productID: product._id,
          variantID: variant._id,
        };

        if (userID) {
          productEntry.isWishlisted = isWishlisted;
        }

        result.push(productEntry);
      });
    }

    if (selectedSortingOptionID === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSortingOptionID === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSortingOptionID === 'creationDateDesc') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const paginatedResult = result.slice(skip, skip + limitNum);

    res.status(200).json({
      totalDataCount: result.length,
      products: paginatedResult
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves all available filter options (colors and sizes) from the products collection.
 * Only includes sizes that currently have stock available.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send back the colors and sizes.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {void} Sends a JSON response with arrays of unique colors and sizes.
 * @throws {Error} If there is an issue querying the products or processing data.
 */
const getAllFiltersDropdown = async (req, res, next) => {
  try {
    const products = await Product.find();

    const colorSet = new Set();
    const sizeSet = new Set();

    for (const product of products) {
      const { variants } = product.toObject();

      for (const variant of variants) {
        if (variant.color) {
          colorSet.add(variant.color);
        }

        variant.sizes?.forEach(sizeObj => {
          if (sizeObj.stock > 0) {
            sizeSet.add(sizeObj.size);
          }
        });
      }
    }

    res.status(200).json({
      colors: Array.from(colorSet),
      sizes: Array.from(sizeSet)
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Fetches detailed information for a specific product variant, including images,
 * available sizes, other color variants, and wishlist status for a user if provided.
 *
 * @param {Object} req - The HTTP request object containing productID, variantID, and optionally userID in the query.
 * @param {Object} res - The HTTP response object used to send the variant details.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If productID or variantID is missing, or if the product/variant is not found.
 * @throws {Error} If an error occurs during the data retrieval process.
 */

const getProductVariantDetails = async (req, res, next) => {
  try {
    const { userID, productID, variantID } = req.query;

    if (!productID || !variantID) {
      throw new CustomError(404, "productID and variantID are required");
    }

    const product = await Product.findById(productID);
    if (!product) {
      throw new CustomError(404, "Product not found");
    }

    const selectedVariant = product.variants.find(
      variant => variant._id.toString() === variantID
    );

    if (!selectedVariant) {
      throw new CustomError(404, "Variant not found");
    }

    const variantImageUrls = (selectedVariant.imageSrc || []).map(publicId =>
      fetchPublicURL(publicId)
    );

    const colorVariants = product.variants
      .filter(variant => variant._id.toString() !== variantID)
      .map(variant => ({
        variantID: variant._id,
        color: variant.color,
        imageSrc: fetchPublicURL(variant.imageSrc?.[0]),
      }));

    const availableSizes = selectedVariant.sizes
      .filter(size => size.stock > 0)
      .map(size => size.size);

    let isWishlisted = false;

    if (userID) {
      const wishlistItem = await WishList.findOne({
        userID,
        productID,
        variantID
      });

      isWishlisted = !!wishlistItem;
    }

    const response = {
      variantDetails: {
        productID: product._id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        category: product.category,
        gender: product.gender,
        variantID: selectedVariant._id,
        color: selectedVariant.color,
        imageSrc: variantImageUrls, 
        price: selectedVariant.price,
        description: selectedVariant.description,
        isWishlisted 
      },
      availableSizes,
      OtherColorVariants: colorVariants
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProducts,
  getProducts,
  getProductVariantDetails,
  getAllFiltersDropdown
};