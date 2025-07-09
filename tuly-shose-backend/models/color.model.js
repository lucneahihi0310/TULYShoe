const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    color_code: {
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

const color = mongoose.model('Color', colorSchema, 'colors');
module.exports = color;