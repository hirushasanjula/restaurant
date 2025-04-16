// server/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true },
  customizations: [{ type: String }],
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  deliveryAddress: { type: String, required: true },
  deliveryInstructions: { type: String, default: '' },
  deliveryOption: {
    type: String,
    enum: ['Priority', 'Standard', 'Schedule'],
    required: true,
  },
  scheduledTime: { type: Date, default: null },
  deliveryFee: { type: Number, required: true },
  taxesAndFees: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);