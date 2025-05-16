const Order = require("../models/order.model");
const Rider = require("../models/rider.model");

const CustomError = require("../utils/customError.utils");
const { getDateFilter } = require("../utils/dateFilter.util");

/*
 * Retrieves all riders with their associated user information.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send JSON data.
 * @param {Function} next - Express next middleware function for error handling.
 * 
 * @returns {void} Responds with JSON containing a list of riders, each including rider ID, user ID, name, and email.
 * @throws {Error} Passes errors to the next middleware for handling.
 */

const getRiders = async (req, res, next) => {
  try {
    const riders = await Rider.find({}, "_id userID").populate({
      path: "userID",
      select: "name email _id",
    });

    const formattedRiders = riders.map((rider) => ({
      riderID: rider._id,
      userID: rider.userID._id,
      name: rider.userID.name,
      email: rider.userID.email,
    }));

    return res.status(200).json({
      message: "Riders fetched successfully",
      riders: formattedRiders,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves paginated orders assigned to the logged-in rider with optional date filtering.
 *
 * @param {Object} req - The HTTP request object containing authenticated user info and query params.
 * @param {Object} res - The HTTP response object used to send the orders data.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the userID is missing or rider not found.
 * @throws {Error} If an error occurs during the fetch operation.
 */

const getOrdersByRider = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      throw new CustomError(400, "userID is required.");
    }

    const rider = await Rider.findOne({ userID });

    if (!rider) {
      throw new CustomError(404, "Rider not found.");
    }

    const { page, limit } = req.query;
    const selectedDataPeriodValue = req.query.selectedDataPeriodValue || "All";

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Apply date filter
    const dateFilter = getDateFilter(selectedDataPeriodValue);
    const query = { riderID: rider._id, ...dateFilter };

    // Get total count of orders for this rider
    const totalOrders = await Order.countDocuments(query);

    // Get paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
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
    }));

    return res.status(200).json({
      message: "Orders fetched successfully for this rider",
      totalDataCount: totalOrders,
      orders: summary,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRiders,
  getOrdersByRider
};
