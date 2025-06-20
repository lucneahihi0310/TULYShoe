const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
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
}, { collection: "brands" });

const brand = mongoose.model('brand', brandSchema);
module.exports = brand;