const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    categories_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand"
    },
    material_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "material"
    },
    form_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "form"
    },
    create_at: {
        type: String,
        default: () => new Date().toISOString()
    },
    update_at: {
        type: String,
        default: () => new Date().toISOString()
    }
}, { collection: "products" });

const product = mongoose.model('product', productSchema);
module.exports = product;