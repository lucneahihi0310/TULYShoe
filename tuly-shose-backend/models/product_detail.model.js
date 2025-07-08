const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    color_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    },
    size_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size"
    },
    discount_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "discount"
    },
    inventory_number: {
        type: Number,
        required: true
    },
    price_after_discount: {
        type: Number,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    product_detail_status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_detail_status"
    },
    create_at: {
        type: String,
        default: () => new Date().toISOString()
    },
    update_at: {
        type: String,
        default: () => new Date().toISOString()
    },
    sold_number: {
        type: Number,
        required: true
    },
}, { collection: "product_details" });

const product_detail = mongoose.model('product_detail', productDetailSchema);
module.exports = product_detail;