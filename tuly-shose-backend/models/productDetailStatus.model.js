const mongoose = require('mongoose');

const ProductDetailStatusSchema = new mongoose.Schema({
  productdetail_status_name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
}, { collection: 'product_detail_status' });

module.exports = mongoose.model('ProductDetailStatus', ProductDetailStatusSchema);
