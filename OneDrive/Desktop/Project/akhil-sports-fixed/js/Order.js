const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true }
  },
  deliveryAddress: {
    address: String,
    city: String,
    district: String,
    pincode: String
  },
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  payment: {
    method: { type: String, enum: ['COD', 'UPI', 'CARD', 'NETBANKING'], required: true },
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);