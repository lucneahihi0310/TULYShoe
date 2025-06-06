const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean
    }
}, { collection: "categories"});

const category = mongoose.model('category', categorySchema);
module.exports = category;