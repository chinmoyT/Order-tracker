const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    areaCovered: { type: String, required: true, trim: true },
    contactNumber: { type: String, trim: true },
    numberOfParties: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Salesman', salesmanSchema);
