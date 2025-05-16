const ApprovedEmail = require("../models/approvedEmail.model");

const CustomError = require("../utils/customError.utils");

/*
 * Adds a new address to the authenticated user's address list.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send the updated addresses.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the user ID is missing or user is not found.
 * @throws {Error} If an error occurs during the process.
 */

const addAddress = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required.");
    }

    const {
      name,
      mobileNumber,
      pinCode,
      address,
      locality,
      district,
      state,
      addressTag,
    } = req.body;

    const newAddress = {
      name,
      mobileNumber,
      pinCode,
      address,
      locality,
      district,
      state,
      addressTag,
      isDeleted: false,
    };

    const user = await ApprovedEmail.findById(userID);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses.filter(addr => !addr.isDeleted),
    });

  } catch (error) {
    next(error);
  }
};

/*
 * Retrieves all active addresses for the authenticated user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send the addresses.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If the user ID is missing or the user is not found.
 * @throws {Error} If an error occurs during the retrieval process.
 */
const getAllAddresses = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!userID) {
      throw new CustomError(400, "User ID is required.");
    }

    const user = await ApprovedEmail.findById(userID);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    const activeAddresses = user.addresses.filter(address => !address.isDeleted);

    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses: activeAddresses,
    });

  } catch (error) {
    next(error);
  }
};

/*
 * Marks a specific address as deleted for the authenticated user.
 *
 * @param {Object} req - The HTTP request object containing addressID in the body.
 * @param {Object} res - The HTTP response object used to send the updated addresses.
 * @param {Function} next - The next middleware function for error handling.
 * @throws {CustomError} If userID or addressID is missing, or if the user or address is not found.
 * @throws {Error} If an error occurs during the update operation.
 */

const deleteAddress = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { addressID } = req.body;

    if (!userID || !addressID) {
      throw new CustomError(400, "User ID and Address ID are required.");
    }

    const user = await ApprovedEmail.findById(userID);

    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    const address = user.addresses.id(addressID);

    if (!address) {
      throw new CustomError(404, "Address not found.");
    }

    address.isDeleted = true;
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses.filter(addr => !addr.isDeleted),
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAddress,
  getAllAddresses,
  deleteAddress,
};
