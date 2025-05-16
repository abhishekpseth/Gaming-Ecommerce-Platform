const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'approved_emails',
  },
  phoneNumber: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Rider = mongoose.model("riders", riderSchema);

module.exports = Rider;