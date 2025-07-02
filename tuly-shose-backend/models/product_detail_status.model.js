const mongoose = require('mongoose');

const productDetailStatusSchema = new mongoose.Schema({
    productdetail_status_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
    create_at: {
        type: String,
        default: () => new Date().toISOString()
    },
    update_at: {
        type: String,
        default: () => new Date().toISOString()
    }
}, { collection: "product_detail_status" });

const product_detail_status = mongoose.model('product_detail_status', productDetailStatusSchema);
module.exports = product_detail_status;