const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
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
}, { timestamps: true });

const WishList = mongoose.model("wishlist", wishlistSchema);

module.exports = WishList;