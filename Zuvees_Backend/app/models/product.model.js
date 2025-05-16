const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: {
    type: String, 
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageSrc: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  sizes: {
    type: [sizeSchema], 
    required: true,
  }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  variants: {
    type: [variantSchema],
    required: true,
  }
}, { timestamps: true });

const Product = mongoose.model('products', productSchema);

module.exports = Product;