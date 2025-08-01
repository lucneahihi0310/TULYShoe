const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size_name: {
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

const size = mongoose.model('Size', sizeSchema, 'sizes');
module.exports = size;