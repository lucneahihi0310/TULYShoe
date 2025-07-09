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
        type: String,
        default: () => new Date().toISOString()
    },
    update_at: {
        type: String,
        default: () => new Date().toISOString()
    }
});

const Category = mongoose.model('Category', categorySchema, 'categories');
module.exports = Category;