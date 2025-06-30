const cron = require('node-cron');
const User = require('../models/account.modle');

const cleanExpiredTokens = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const result = await User.updateMany(
                { resetToken: { $ne: null }, resetTokenExpiration: { $lt: Date.now() } },
                { $set: { resetToken: null, resetTokenExpiration: null } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Đã xóa ${result.modifiedCount} token đặt lại mật khẩu hết hạn.`);
            }
        } catch (error) {
            console.error('Lỗi khi xóa token hết hạn:', error);
        }
    });
};

module.exports = { cleanExpiredTokens };