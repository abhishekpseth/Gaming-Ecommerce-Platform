const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const CustomError = require("../utils/customError.utils");

const { fetchPublicURL } = require("../utils/cloudinary");
const { getDateFilter } = require("../utils/dateFilter.util");

/*
 * Creates a new order for the authenticated user by validating stock, reducing inventory,
 * saving the order, and removing purchased items from the cart. Uses a MongoDB transaction
 * to ensure atomicity across all operations.
 *
 * @param {Object} req - The HTTP request object containing user ID and order details (products, address, payment method, total amount).
 * @param {Object} res - The HTTP response object used to send the created order details.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If any required field is missing, product/variant/size is not found, or stock is insufficient.
 * @throws {Error} If an error occurs during the transaction or database operations.
 */
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userID = req.user._id;
    const { products, address, paymentMethod, totalAmount } = req.body;

    if (!userID || !Array.isArray(products) || products.length === 0 || !address) {
      throw new CustomError(400, "All required fields must be provided.");
    }

    // Reducing stock
    for (const item of products) {
      const { productID, variantID, color, size, quantity } = item;

      const product = await Product.findById(productID).session(session);
      if (!product) throw new CustomError(404, "Product not found");

      const variant = product.variants.find(v =>
        v._id.equals(mongoose.Types.ObjectId.createFromHexString(variantID))
      );
      if (!variant) throw new CustomError(404, "Variant not found");

      const sizeObj = variant.sizes.find(s => s.size === size);
      if (!sizeObj) throw new CustomError(404, "Size not found");

      if (sizeObj.stock < quantity) {
        throw new CustomError(400, `Not enough stock for ${product.name} - ${variant.color} (${size})`);
      }

      sizeObj.stock -= quantity;
      await product.save({ session });
    }

    // Saving new order
    const newOrder = new Order({
      userID,
      products,
      address,
      status: "Paid",
      paymentMethod,
      totalAmount,
    });

    const savedOrder = await newOrder.save({ session });

    // Removing items from cart
    for (const item of products) {
      const { productID, variantID, size } = item;
      await Cart.deleteOne(
        { userID, productID, variantID, size },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/*
 * Retrieves a paginated list of all orders, optionally filtered by a selected date range.
 * Includes populated user and rider information and returns a summarized response.
 *
 * @param {Object} req - The HTTP request object containing pagination and date filter parameters.
 * @param {Object} res - The HTTP response object used to send the list of summarized orders and total count.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {Error} If an error occurs while querying or populating the orders.
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const selectedDataPeriodValue = req.query.selectedDataPeriodValue || "All";

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const dateFilter = getDateFilter(selectedDataPeriodValue);
    const query = { ...dateFilter };

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({
        path: "riderID",
        select: "_id phoneNumber userID",
        populate: {
          path: "userID",
          model: "approved_emails",
          select: "name",
        },
      })
      .populate("userID", "name");

    const summary = orders.map(order => ({
      _id: order._id,
      userID: order.userID,
      orderID: order.orderID,
      address: order.address,
      status: order.status,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      productListSize: Array.isArray(order.products) ? order.products.length : 0,
      riderID: order.riderID?._id || null,
      riderName: order.riderID?.userID?.name || null,
      riderPhoneNumber: order.riderID?.phoneNumber || null,
    }));

    return res.status(200).json({
      message: "All orders fetched successfully",
      totalDataCount: totalOrders,
      orders: summary,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves a paginated list of orders placed by the authenticated user, optionally filtered by a selected date range.
 * Returns summarized order details including address, status, payment method, and total amount.
 *
 * @param {Object} req - The HTTP request object containing the user's ID and optional query parameters for pagination and date filtering.
 * @param {Object} res - The HTTP response object used to send the user's order summaries and total count.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the user ID is missing from the request.
 * @throws {Error} If an error occurs while retrieving or processing the user's orders.
 */
const getOrdersDetails = async (req, res, next) => {
  try {
    const userID = req.user?._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required.");
    }

    const { page, limit } = req.query;
    const selectedDataPeriodValue = req.query.selectedDataPeriodValue || "All";

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build query using utility
    const dateFilter = getDateFilter(selectedDataPeriodValue);
    const query = { userID, ...dateFilter };

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const summary = orders.map(({ _id, orderID, address, status, createdAt, paymentMethod, totalAmount, products }) => ({
      _id,
      orderID,
      address,
      status,
      createdAt,
      paymentMethod,
      totalAmount,
      productListSize: Array.isArray(products) ? products.length : 0,
    }));

    return res.status(200).json({
      message: "Orders fetched successfully",
      totalDataCount: totalOrders,
      orders: summary,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves detailed product information for a specific order by order ID,
 * including resolving public URLs for product images.
 *
 * @param {Object} req - The HTTP request object containing the order ID in the query parameters.
 * @param {Object} res - The HTTP response object used to send the detailed product data.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the order ID is missing or the order is not found.
 * @throws {Error} If an error occurs while retrieving or processing the order data.
 */

const getProductDetailsOfOrder = async (req, res, next) => {
  try {
    const { orderID } = req.query;

    if (!orderID) {
      throw new CustomError(400, "Order ID is required.");
    }

    const order = await Order.findById(orderID);
    if (!order) {
      throw new CustomError(404, "Order not found.");
    }

    const products = order?.products || [];

    // If you still need to resolve public image URLs
    const enrichedProducts = await Promise.all(products.map(async (item) => {
      const imageUrls = (item.images || []).map(publicId =>
        fetchPublicURL(publicId)
      );

      return {
        ...item.toObject(),
        images: imageUrls,
      };
    }));

    return res.status(200).json({
      message: "Order fetched successfully",
      products: enrichedProducts
    });

  } catch (error) {
    next(error);
  }
};

/*
 * Updates the assigned rider for a specific order.
 *
 * @param {Object} req - The HTTP request object containing orderID and riderID in the body.
 * @param {Object} res - The HTTP response object used to send the updated order.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the riderID is missing or the order is not found.
 * @throws {Error} If an error occurs during the update operation.
 */

const updateRider = async (req, res, next) => {
  try {
    const { orderID, riderID } = req.body;

    if (!riderID) {
      throw new CustomError(400, "Rider ID is required");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderID,
      {
        riderID: mongoose.Types.ObjectId.createFromHexString(riderID),
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new CustomError(404, "Order not found");
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Updates the status of a specific order.
 *
 * @param {Object} req - The HTTP request object containing orderID and the new status in the body.
 * @param {Object} res - The HTTP response object used to send the updated order details.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the status is missing or the order is not found.
 * @throws {Error} If an error occurs during the update operation.
 */

const updateStatus = async (req, res, next) => {
  try {
    const { orderID, status } = req.body;

    if (!status) {
      throw new CustomError(400, "Status is required");
    }

    const updateData = {};
    updateData.status = status;

    const updatedOrder = await Order.findByIdAndUpdate(orderID, updateData, { new: true });

    if (!updatedOrder) {
      throw new CustomError(404, "Order not found");
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersDetails,
  getProductDetailsOfOrder,
  updateRider,
  updateStatus
};
