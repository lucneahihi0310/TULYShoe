const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    form_name: {
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
}, { collection: "forms" });

const form = mongoose.model('form', formSchema);
module.exports = form;