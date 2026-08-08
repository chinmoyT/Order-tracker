const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    item: { type: String, required: true, trim: true },
    bags: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderDate: { type: Date, required: true },
    vendorName: { type: String, required: true, trim: true },
    salesmanName: { type: String, trim: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'At least one order item is required',
      },
    },
    totalBags: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'dispatched'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
