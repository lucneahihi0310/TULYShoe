const mongoose = require('mongoose');

const genderSchema = new mongoose.Schema({
    gender_name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean
    },
    create_at: {
        type: Date,
        required: true
    },
    update_at: {
        type: Date,
        required: true
    }
});

const Gender = mongoose.model('Gender', genderSchema);

module.exports = Gender;