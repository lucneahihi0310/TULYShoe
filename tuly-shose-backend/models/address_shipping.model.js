const mongoose = require("mongoose");

const addressShippingSchema = new mongoose.Schema({
    address: { type: String, required: true },
    create_at: { type: Date, default: Date.now, required: true },
    update_at: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("AddressShipping", addressShippingSchema, "address_shipping");