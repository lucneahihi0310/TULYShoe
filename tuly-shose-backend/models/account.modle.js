const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    address_shipping_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddressShipping', default: null
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    avatar_image: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    create_at: { type: Date, default: Date.now, required: true },
    update_at: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model("Account", accountSchema);