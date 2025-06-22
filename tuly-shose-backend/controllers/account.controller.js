const User = require('../models/account.modle');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                avatar_image: user.avatar_image
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { first_name, last_name, dob, gender, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email đã tồn tại!' });

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
        const user = await User.findById(req.customerId).select('first_name last_name avatar_image role');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
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
        if (exists) return res.status(400).json({ message: 'Email đã tồn tại!' });

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

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });

        // Generate and hash reset token
        const resetToken = crypto.randomBytes(6).toString('hex').toUpperCase();
        const hashedToken = await bcrypt.hash(resetToken, 10); // Hash with salt

        const tokenExpirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Save hashed token and expiration to user
        user.resetToken = hashedToken;
        user.resetTokenExpiration = tokenExpirationTime;
        await user.save();

        // Send email with plaintext token
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Đặt lại mật khẩu của bạn",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <img src="https://duongvanluc2002.sirv.com/black_on_trans.png" width="100" height="100" alt="Logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                        <h2 style="color: #333; text-align: center;">Xin chào ${user.first_name} ${user.last_name}</h2>
                        <p style="font-size: 16px; color: #555;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã dưới đây để thay đổi mật khẩu của bạn:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <h3 style="font-size: 24px; color: #007bff; font-weight: bold;">${resetToken}</h3>
                        </div>
                        <p style="font-size: 16px; color: #555;">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này. Mã đặt lại mật khẩu này sẽ hết hạn trong vòng 5 phút.</p>
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
                        <p style="font-size: 14px; color: #777; text-align: center;">Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ với chúng tôi qua email này.</p>
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="font-size: 14px; color: #777;">Trân trọng,</p>
                            <p style="font-size: 14px; color: #777;">Đội ngũ hỗ trợ khách hàng TULY Shoe</p>
                        </div>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).json({ message: "Gửi email thất bại!" });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, resetToken: inputToken, newPassword } = req.body;
        const user = await User.findOne({ email, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Mã đặt lại không hợp lệ hoặc đã hết hạn!' });

        // Compare input token with hashed token
        const isValidToken = await bcrypt.compare(inputToken.toUpperCase(), user.resetToken);
        if (!isValidToken) {
            return res.status(400).json({ message: 'Mã đặt lại không hợp lệ!' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
    } catch (error) {
        console.error("Lỗi đặt lại mật khẩu:", error);
        res.status(500).json({ message: "Đặt lại mật khẩu thất bại!" });
    }
};