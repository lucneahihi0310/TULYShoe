const mongoose = require("mongoose");
const Account = require("./account.modle");
const OrderDetail = require("./oderDetail.model");

const reviewSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    ordetail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail",
        required: true,
    },
    review_content: { type: String, required: true },
    images: [{ type: String }],
    rating: { type: Number, required: true },
    review_date: { type: Date, required: true },
    is_approved: { type: Boolean, required: true },
    replies: {
        replier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        },
        reply_content: { type: String },
        reply_date: { type: Date },
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: Date.now }
    },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");