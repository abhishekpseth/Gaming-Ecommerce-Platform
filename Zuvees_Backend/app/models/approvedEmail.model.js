const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  addressTag: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const approvedEmailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: false,
  },
  roles: {
    type: [String],
    required: true,
  },
  addresses: {
    type: [addressSchema],
    required: false,
  }
}, { timestamps: true });

const ApprovedEmail = mongoose.model("approved_emails", approvedEmailSchema);

module.exports = ApprovedEmail;