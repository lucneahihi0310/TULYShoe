const mongoose = require('mongoose');

const productDetailStatusSchema = new mongoose.Schema({

    productdetail_status_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    create_at: {
        type: Date
    },
    update_at: {
        type: Date
    }
});
const ProductDetailStatus = mongoose.model('ProductDetailStatus', productDetailStatusSchema, 'product_detail_status');
module.exports = ProductDetailStatus;