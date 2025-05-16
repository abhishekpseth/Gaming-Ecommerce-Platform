const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'approved_emails',
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  variantID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;