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
    email: { type: String, required: true, unique: [true, 'Email must be unique value'] },
    phone: { type: String, required: true, unique: [true, 'Phone must be unique value'] },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    avatar_image: { type: String, default: "https://duongvanluc2002.sirv.com/hinh-ve-la-co-viet-nam_021823685.jpg" },
    is_active: { type: Boolean, required: true, default: true },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
    create_at: { type: Date},
    update_at: { type: Date}
});

module.exports = mongoose.model("Account", accountSchema);