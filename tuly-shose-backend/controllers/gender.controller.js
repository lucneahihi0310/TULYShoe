const gender = require('../models/gender.model');
const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

exports.list_gender = async (req, res, next) => {
    try {
        const newGender = await gender.find();
        const listGender = newGender.map((c) => {
            return {
                _id: c.id,
                gender_name: c.gender_name,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listGender);
    } catch (error) {
        next(error);
    }
}