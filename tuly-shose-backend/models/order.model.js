const mongoose = require("mongoose");

const orderShema = new mongoose.Schema({

    order_code: { type: String, required: true, unique: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    },
    shipping_info: {
        full_name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: null },
        address: { type: String, required: true }
    },
    order_date: { type: Date, required: true },
    order_status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderStatus",
        required: true,
    },
    delivery_date: { type: Date, required: true },
    order_note: { type: String, default: null },
    total_amount: { type: Number, required: true },
    payment_status: { type: String, required: true },
    accepted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    },
    create_at: { type: Date },
    update_at: { type: Date }
});

module.exports = mongoose.model("Order", orderShema, "orders");