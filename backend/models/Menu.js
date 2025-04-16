// server/models/Menu.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['appetizer', 'main', 'dessert', 'beverage', 'pizza', 'burger'] },
  subcategory: { type: String, trim: true }, 
  image: { type: String }, 
  available: { type: Boolean, default: true },
  featuredItem: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);