const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({

    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    productdetail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetail",
        required: true,
    },
    quantity: { type: Number, required: true },
    price_at_order: { type: Number, required: true },
    create_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderDetail", orderDetailSchema, "order_details");