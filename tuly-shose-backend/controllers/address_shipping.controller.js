const Address = require("../models/address_shipping.model");

exports.getAllAddress = async (req, res, next) => {
    try {
        const addresses = await Address.find().populate('user_id', 'first_name last_name');
        res.json(addresses);
    } catch (error) {
        next(error);
    }
}
exports.getAddressById = async (req, res, next) => {
    try {
        const address = await Address.findById(req.params.id).populate('user_id', 'first_name last_name');
        if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });
        res.json(address);
    } catch (error) {
        next(error);
    }
}
exports.addAddress = async (req, res, next) => {
    try {
        const { user_id, address } = req.body;

        if (!address) return res.status(400).json({ message: 'Địa chỉ không được để trống!' });

        const newAddress = await Address.create({
            user_id,
            address,
            create_at: Date.now(),
            update_at: null
        });

        res.status(201).json(newAddress);
    } catch (error) {
        next(error);
    }
}
exports.updateAddress = async (req, res, next) => {
    try {
        const { address } = req.body;

        if (!address) return res.status(400).json({ message: 'Địa chỉ không được để trống!' });

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { address, update_at: Date.now() },
            { new: true }
        );

        if (!updatedAddress) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });

        res.json(updatedAddress);
    } catch (error) {
        next(error);
    }
}
exports.deleteAddress = async (req, res, next) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);

        if (!deletedAddress) return res.status(404).json({ message: 'Không tìm thấy địa chỉ!' });

        res.json({ message: 'Địa chỉ đã được xóa thành công!' });
    } catch (error) {
        next(error);
    }
}