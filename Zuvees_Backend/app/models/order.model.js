const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "products", 
      required: true 
    },
    variantID: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String, 
      required: true 
    },
    size: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1 
    },
    price: {
      type: Number, 
      required: true,
    },
    images: {
      type: [String],
      required: false,
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: Number,
      unique: true,
    },
    userID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'approved_emails',
      required: true 
    },
    products: [orderItemSchema],
    address: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Paid", "Shipped", "Delivered", "Undelivered", "Cancelled"], 
      default: "Paid" 
    },
    riderID: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'riders',
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderID) {
    let unique = false;
    while (!unique) {
      const randomID = Math.floor(1000000 + Math.random() * 9000000); // Generates a 7-digit number
      const existing = await mongoose.models.orders.findOne({ orderID: randomID });
      if (!existing) {
        this.orderID = randomID;
        unique = true;
      }
    }
  }
  next();
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
