const Support = require("../models/support.model");
const transporter = require("../config/email");

exports.submitSupportForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    // Validate phone format
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!" });
    }

    // Lưu thông tin vào MongoDB
    const supportRequest = new Support({
      name,
      email,
      phone,
      message,
    });
    await supportRequest.save();

    // Gửi email thông báo đến admin
    const adminMailOptions = {
      from: `"TULY Shoe Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Yêu cầu hỗ trợ mới từ ${name}`,
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
            <h2 class="text-dark-mode" style="color: #333; text-align: center;">Yêu cầu hỗ trợ mới</h2>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Tên:</strong> ${name}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Số điện thoại:</strong> ${phone}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Nội dung:</strong> ${message}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
            <p class="text-dark-mode" style="font-size: 14px; color: #777; text-align: center;">Đội ngũ hỗ trợ khách hàng TULY Shoe</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Gửi email xác nhận đến khách hàng
    const customerMailOptions = {
      from: `"TULY Shoe Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác nhận yêu cầu hỗ trợ từ TULY Shoe",
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
            <h2 class="text-dark-mode" style="color: #333; text-align: center;">Xin chào ${name}</h2>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;">Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Số điện thoại:</strong> ${phone}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Nội dung bạn gửi:</strong> ${message}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;"><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
            <p class="text-dark-mode" style="font-size: 16px; color: #555;">Nếu bạn có thêm câu hỏi, vui lòng liên hệ qua email này.</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
            <p class="text-dark-mode" style="font-size: 14px; color: #777; text-align: center;">Trân trọng,</p>
            <p class="text-dark-mode" style="font-size: 14px; color: #777; text-align: center;">Đội ngũ hỗ trợ khách hàng TULY Shoe</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ message: "Yêu cầu hỗ trợ đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu hỗ trợ:", error);
    res.status(500).json({ message: "Lỗi server khi gửi yêu cầu hỗ trợ", error: error.message });
  }
};