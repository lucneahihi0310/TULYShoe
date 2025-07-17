const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    percent_discount: {
        type: Number,
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
    start_date: {
        type: String,
        default: () => new Date().toISOString()
    },
    end_date: {
        type: String,
        default: () => new Date().toISOString()
    },
    update_at: {
        type: String,
        default: () => new Date().toISOString()
    }
}, { collection: "discounts" });

const discount = mongoose.model('discount', discountSchema);
module.exports = discount;