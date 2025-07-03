const form = require('../models/form.model');
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

exports.list_form = async (req, res, next) => {
    try {
        const newForm = await form.find();
        const listForm = newForm.map((c) => {
            return {
                _id: c.id,
                form_name: c.form_name,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listForm);
    } catch (error) {
        next(error);
    }
}

exports.create_form = async (req, res, next) => {
    try {
        const newForm = new form({
            form_name: req.body.form_name,
            is_active: req.body.is_active
        })
        const insertForm = await newForm.save();
        res.status(201).json(insertForm);
    } catch (error) {
        next(error);
    }
}

exports.edit_form = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { form_name, is_active } = req.body;
        const updatedForm = await form.findByIdAndUpdate(
            id,
            { form_name, is_active, update_at: new Date().toISOString() },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );
        res.status(201).json(updatedForm);
    } catch (error) {
        next(error);
    }
}

exports.delete_form = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteForm = await form.findByIdAndDelete(id);
        res.status(201).json(deleteForm);
    } catch (error) {
        next(error);
    }
}