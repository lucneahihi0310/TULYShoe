const mongoose = require("mongoose");

const addressShippingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', default: null
    },
    address: { type: String, required: true },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("AddressShipping", addressShippingSchema, "address_shipping");