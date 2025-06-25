const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Phải khớp
    color_id: mongoose.Schema.Types.ObjectId,
    size_id: mongoose.Schema.Types.ObjectId,
    discount_id: mongoose.Schema.Types.ObjectId,
    inventory_number: Number,
    price_after_discount: Number,
    images: [String],
    product_detail_status: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetailStatus' },
    create_at: Date,
    update_at: Date
}, { collection: 'product_details' }); // Đảm bảo đúng collection name

module.exports = mongoose.model('ProductDetail', productDetailSchema);
