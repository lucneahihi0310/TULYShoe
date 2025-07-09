const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brand_name: {
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

const brand = mongoose.model('Brand', brandSchema, 'brands');
module.exports = brand;