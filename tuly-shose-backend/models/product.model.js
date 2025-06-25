const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: Number,
    categories_id: mongoose.Schema.Types.ObjectId,
    brand_id: mongoose.Schema.Types.ObjectId,
    material_id: mongoose.Schema.Types.ObjectId,
    form_id: mongoose.Schema.Types.ObjectId,
    create_at: Date,
    update_at: Date
}, { collection: 'products' }); // Đảm bảo đúng collection name

module.exports = mongoose.model('Product', productSchema); // Tên model phải là 'Product'
