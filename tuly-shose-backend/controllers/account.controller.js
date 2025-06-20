const User = require('../models/account.modle');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { first_name, last_name, dob, gender, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ first_name, last_name, dob, gender, email, password: passwordHash, phone });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

exports.listAll = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
};


exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.customerId).select('first_name last_name avatar_image');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.addAccount = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            dob,
            gender,
            address_shipping_id,
            email,
            phone,
            password,
            role,
            avatar_image,
            is_active,
            create_at,
            update_at
        } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email exists' });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            dob,
            gender,
            address_shipping_id,
            email,
            phone,
            password: passwordHash,
            role: role || "user",
            avatar_image: avatar_image || null,
            is_active: typeof is_active === 'boolean' ? is_active : true,
            create_at: create_at || Date.now(),
            update_at: update_at || Date.now()
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};