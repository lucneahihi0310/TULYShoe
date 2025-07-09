const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    percent_discount: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    create_at: {
        type: Date
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date
    },
    update_at: {
        type: Date
    }
});
const discount = mongoose.model('Discount', discountSchema, 'discounts');
module.exports = discount;