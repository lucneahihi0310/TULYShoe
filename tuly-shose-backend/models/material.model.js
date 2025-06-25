const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_name: {
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
}, { collection: "materials" });

const material = mongoose.model('material', materialSchema);
module.exports = material;