const User = require('../models/account.modle');
const Address = require('../models/address_shipping.model');
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


exports.getFullUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.customerId)
            .select("first_name last_name dob gender phone email avatar_image address_shipping_id")
            .populate({
                path: "address_shipping_id",
                select: "address",
            });

        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            email: user.email,
            avatar_image: user.avatar_image || "",
            address: user.address_shipping_id?.address || "",
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng!" });
    }
};

// Cập nhật thông tin người dùng (KHÔNG bao gồm avatar)
exports.updateProfileUser = async (req, res) => {
    try {
        const { first_name, last_name, phone, dob, gender, address, email } = req.body;

        const user = await User.findById(req.customerId);

        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        user.first_name = first_name || "";
        user.last_name = last_name || user.last_name;
        user.dob = dob || user.dob;
        user.gender = gender || user.gender;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.update_at = new Date();

        if (address && user.address_shipping_id) {
            await Address.findByIdAndUpdate(user.address_shipping_id, {
                address,
                update_at: new Date(),
            });
        }

        await user.save();

        res.json({
            message: 'Cập nhật thông tin thành công',
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                dob: user.dob,
                gender: user.gender,
                phone: user.phone,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Cập nhật thông tin thất bại:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        const imageUrl = req.file.path || req.file.secure_url;

        const user = await User.findByIdAndUpdate(
            req.customerId,
            { avatar_image: imageUrl, update_at: Date.now() },
            { new: true }
        ).select('-password');
        console.log("Uploaded file:", req.file);
        res.json({
            message: 'Cập nhật ảnh đại diện thành công',
            avatar: user.avatar_image,
        });
    } catch (error) {
        console.error('Upload avatar failed:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật avatar' });
    }
};

exports.changePasswordUser = async (req, res) => {
    try {
        const userId = req.customerId;
        const { current_password, new_password } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        }

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
        console.error("[CHANGE PASSWORD ERROR]", err);
        res.status(500).json({ message: "Lỗi đổi mật khẩu" });
    }
};

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
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { first_name, last_name, dob, gender, address, email, phone, password } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !dob || !gender || !address || !email || !phone || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc!' });
        }

        // Check for existing email
        const existsEmail = await User.findOne({ email });
        if (existsEmail) return res.status(400).json({ message: 'Email đã tồn tại!' });

        // Check for existing phone
        const existsPhone = await User.findOne({ phone });
        if (existsPhone) return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new address
        const newAddress = await Address.create({
            address,
            create_at: Date.now(),
            update_at: null
        });

        // Create new user with address_shipping_id
        const user = await User.create({
            first_name,
            last_name,
            dob,
            gender,
            address_shipping_id: newAddress._id,
            email,
            phone,
            password: passwordHash,
            create_at: Date.now(),
            update_at: null
        });

        // Update address with user_id
        await Address.findByIdAndUpdate(newAddress._id, { user_id: user._id });

        res.status(201).json({ message: 'Đăng ký thành công!', user: { email: user.email, first_name: user.first_name } });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
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
            address,
            email,
            phone,
            password
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !dob || !gender || !address || !email || !phone || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc!' });
        }

        // Check for existing email
        const existsEmail = await User.findOne({ email });
        if (existsEmail) return res.status(400).json({ message: 'Email đã tồn tại!' });

        // Check for existing phone
        const existsPhone = await User.findOne({ phone });
        if (existsPhone) return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new address
        const newAddress = await Address.create({
            address,
            create_at: Date.now(),
            update_at: null
        });

        // Create new user
        const user = await User.create({
            first_name,
            last_name,
            dob,
            gender,
            address_shipping_id: newAddress._id,
            email,
            phone,
            password: passwordHash,
            role: "user",
            avatar_image: null,
            is_active: true,
            create_at: Date.now(),
            update_at: Date.now()
        });

        // Update address with user_id
        await Address.findByIdAndUpdate(newAddress._id, { user_id: user._id });

        res.status(201).json(user);
    } catch (error) {
        console.error("Lỗi thêm tài khoản:", error);
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });

        const resetToken = crypto.randomBytes(6).toString('hex').toUpperCase();
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const tokenExpirationTime = Date.now() + 5 * 60 * 1000;

        user.resetToken = hashedToken;
        user.resetTokenExpiration = tokenExpirationTime;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Đặt lại mật khẩu của bạn",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <style>
                    @media (prefers-color-scheme: dark) {
                    .logo {
                        content: url('https://duongvanluc2002.sirv.com/logo_trang.png');
                    }
                    .text-dark-mode {
                        color: #ffffff !important;
                    }
                    .container {
                        background-color: #1a1a1a !important;
                    }
                    }
                </style>
                <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <img src="https://duongvanluc2002.sirv.com/logo_den.png" width="200" height="auto" alt="Logo" class="logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                    
                    <h2 class="text-dark-mode" style="color: #333; text-align: center;">Xin chào ${user.first_name} ${user.last_name}</h2>
                    <p class="text-dark-mode" style="font-size: 16px; color: #555;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã dưới đây để thay đổi mật khẩu của bạn:</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                    <h3 style="font-size: 24px; color: #007bff; font-weight: bold;">${resetToken}</h3>
                    </div>
                    
                    <p class="text-dark-mode" style="font-size: 16px; color: #555;">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này. Mã đặt lại mật khẩu này sẽ hết hạn trong vòng 5 phút.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p class="text-dark-mode" style="font-size: 14px; color: #777; text-align: center;">Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ với chúng tôi qua email này.</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                    <p class="text-dark-mode" style="font-size: 14px; color: #777;">Trân trọng,</p>
                    <p class="text-dark-mode" style="font-size: 14px; color: #777;">Đội ngũ hỗ trợ khách hàng TULY Shoe</p>
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

        const isValidToken = await bcrypt.compare(inputToken.toUpperCase(), user.resetToken);
        if (!isValidToken) {
            return res.status(400).json({ message: 'Mã đặt lại không hợp lệ!' });
        }

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

// GET /account/info

exports.getProfile = async (req, res) => {
    try {
        const account = await User.findById(req.params.id)
            .select('-password -resetToken -resetTokenExpiration')
            .populate('address_shipping_id', 'address');

        if (!account) return res.status(404).json({ message: 'Account not found' });

        // Trả về thêm address_id
        const result = {
            ...account._doc,
            address: account.address_shipping_id ? account.address_shipping_id.address : null,
            address_id: account.address_shipping_id ? account.address_shipping_id._id : null // Thêm ID địa chỉ
        };

        delete result.address_shipping_id;

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, dob, gender, phone, avatar_image, address } = req.body;

        const updatedAccount = await User.findByIdAndUpdate(
            req.params.id,
            {
                first_name,
                last_name,
                dob,
                gender,
                phone,
                avatar_image,
                address,
                update_at: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -resetToken -resetTokenExpiration');

        if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });

        res.status(200).json({ message: 'Profile updated successfully', account: updatedAccount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStatusAccount = async (req, res) => {
    try {
        const { is_active } = req.body;

        const updatedAccount = await User.findByIdAndUpdate(
            req.params.id,
            {
                is_active,
                update_at: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -resetToken -resetTokenExpiration');

        if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });

        res.status(200).json({ message: 'Account change status successfully', account: updatedAccount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.delete_account = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteAccount = await User.findByIdAndDelete(id);
        res.status(201).json({ message: 'Account delete successfully', account: deleteAccount });
    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req, res) => {
    try {
        console.log('Request Params:', req.params);
        console.log('Request Body:', req.body);

        const { oldPassword, newPassword } = req.body;

        const account = await User.findById(req.params.id);
        if (!account) {
            console.log('Account not found');
            return res.status(404).json({ message: 'Account not found' });
        }

        console.log('Account found:', account);

        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            console.log('Old password is incorrect');
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(newPassword, salt);
        account.update_at = new Date();

        await account.save();

        console.log('Password changed successfully');
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { first_name, last_name, dob, gender, phone, email } = req.body;

        const updatedAccount = await User.findByIdAndUpdate(
            req.params.id,
            {
                first_name,
                last_name,
                dob,
                gender,
                phone,
                email,
                update_at: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -resetToken -resetTokenExpiration');

        if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });

        res.status(200).json({ message: 'Profile updated successfully', account: updatedAccount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};