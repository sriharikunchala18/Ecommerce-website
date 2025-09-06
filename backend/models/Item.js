const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  images: [String],
  stock: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Item', ItemSchema);
