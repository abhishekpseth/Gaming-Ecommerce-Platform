const CustomError = require('../../utils/customError.utils.js');

/*
 * Express error-handling middleware that formats and sends error responses.
 * Differentiates between CustomError instances and generic errors.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send the error response.
 * @param {Function} next - The next middleware function.
 */

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomError) {
    const { statusCode, message, details } = err;
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      details,
    });
  } else {
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
      details: err.message,
    });
  }
};

module.exports = errorHandler;