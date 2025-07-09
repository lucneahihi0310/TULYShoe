const mongoose = require("mongoose");
const Category = require("./category.model");
const Brand = require("./brand.model");
const Material = require("./material.model");
const Gender = require("./gender.model");
const Form = require("./form.model");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categories_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    gender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gender', required: true },
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("Product", productSchema);