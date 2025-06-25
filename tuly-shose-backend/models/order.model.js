const mongoose = require("mongoose");

const orderShema = new mongoose.Schema({

    order_code: { type: String, required: true, unique: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    order_date: { type: Date, required: true },
    order_status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderStatus",
        required: true,
    },
    address_shipping_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    delivery_date: { type: Date, required: true },
    order_note: { type: String },
    total_amount: { type: Number, required: true },
    payment_status: { type: String, required: true },
    accepted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("Order", orderShema, "orders");