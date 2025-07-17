const mongoose = require("mongoose");
const Product = require("./product.model");
const Color = require("./color.model");
const Size = require("./size.model");
const Discount = require("./discounts.model");
const ProductDetailStatus = require("./productDetailStatus.model");

const productDetailSchema = new mongoose.Schema({

    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    color_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true,
    },
    size_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true,
    },
    discount_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
        required: true,
    },
    inventory_number: { type: Number, required: true },
    sold_number: { type: Number, required: true },
    price_after_discount: { type: Number, required: true },
    images: [{ type: String, required: true }],
    product_detail_status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetailStatus",
        required: true,
    },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("ProductDetail", productDetailSchema, "product_details");