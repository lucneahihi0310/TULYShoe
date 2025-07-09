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
});

module.exports = mongoose.model('Form', formSchema, 'forms');