require("dotenv").config();
const mongoose = require('mongoose');

/*
 * Establishes a connection to the MongoDB database using the connection URI from environment variables.
 * Logs success or error messages accordingly.
 * Exits the process if the connection fails.
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
