const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean
    },
    create_at: {
        type: Date,
    },
    update_at: {
        type: Date,
    }
}, { collection: "categories" });

const category = mongoose.model('category', categorySchema);
module.exports = category;