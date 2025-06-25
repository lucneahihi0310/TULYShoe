const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categories_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("Product", productSchema);