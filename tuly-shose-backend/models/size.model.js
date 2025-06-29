const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
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
}, { collection: "sizes" });

const size = mongoose.model('size', sizeSchema);
module.exports = size;