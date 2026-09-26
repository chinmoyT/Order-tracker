const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salesman: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    balanceDue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
