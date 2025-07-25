const crypto = require("crypto");
const Order = require("../models/order.model");
const OrderDetail = require("../models/oderDetail.model");
const PendingOrder = require("../models/pendingOrder.model");
const ProductDetail = require("../models/productDetail.model");
const CartItem = require("../models/cartItem.model");
const Notification = require("../models/notification.model"); // Added
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const DEFAULT_ORDER_STATUS_ID = "60a4c8b2f9a2d3c4e5f6a881";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// VNPAY configuration
const vnp_TmnCode = "IQGVN28J";
const vnp_HashSecret = "2OM8RGUD4LTEEVIG2CLEVHEA2BFEPTOK";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "https://tulyshoe.onrender.com/vnpay/return";
const vnp_IpnUrl = "https://tulyshoe.onrender.com/vnpay/ipn";

// Helper function to sort object keys alphabetically
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// Helper function to create VNPAY secure hash
function createSecureHash(data) {
  const sortedData = sortObject(data);
  const signData = Object.keys(sortedData)
    .map((key) => `${key}=${encodeURIComponent(sortedData[key]).replace(/%20/g, "+")}`)
    .join("&");
  return crypto.createHmac("sha512", vnp_HashSecret).update(signData).digest("hex");
}

exports.createPayment = async (req, res) => {
  try {
    const { orderItems, userInfo, paymentMethod, orderNote, shippingFee, user_id, isFromCart } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ." });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price_after_discount,
      0
    ) + shippingFee;

    const isHanoi = userInfo.address?.toLowerCase().includes("hà nội");
    const deliveryDays = isHanoi ? 3 : 5;
    const now = new Date();
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + deliveryDays);

    const orderCode = `TULY-${Date.now()}`;

    await PendingOrder.create({
      order_code: orderCode,
      orderItems,
      userInfo,
      shippingFee,
      orderNote,
      user_id,
      paymentMethod,
      isFromCart,
      deliveryDate,
    });

    const createDate = now.toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress;

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Amount: totalAmount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toán đơn hàng ${orderCode}`,
      vnp_OrderType: "250000",
      vnp_Locale: "vn",
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
      vnp_ReturnUrl: vnp_ReturnUrl,
    };

    vnpParams.vnp_SecureHash = createSecureHash(vnpParams);
    const queryString = new URLSearchParams(sortObject(vnpParams)).toString();
    const paymentUrl = `${vnp_Url}?${queryString}`;

    return res.status(200).json({
      message: "Tạo liên kết thanh toán thành công!",
      paymentUrl,
      order_code: orderCode,
    });
  } catch (err) {
    console.error("Lỗi khi tạo thanh toán VNPAY:", err);
    return res.status(500).json({ message: "Lỗi server khi xử lý thanh toán." });
  }
};

exports.ipn = async (req, res) => {
  try {
    let vnpParams = req.query;
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const calculatedHash = createSecureHash(vnpParams);

    if (secureHash !== calculatedHash) {
      return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }

    const orderCode = vnpParams["vnp_TxnRef"];
    const vnpResponseCode = vnpParams["vnp_ResponseCode"];

    if (vnpResponseCode !== "00") {
      return res.status(200).json({ RspCode: vnpResponseCode, Message: "Payment failed" });
    }

    const pending = await PendingOrder.findOne({ order_code: orderCode });
    if (!pending) {
      return res.status(404).json({ RspCode: "01", Message: "Không tìm thấy đơn hàng chờ." });
    }

    const {
      orderItems,
      userInfo,
      shippingFee,
      orderNote,
      user_id,
      paymentMethod,
      isFromCart,
      deliveryDate,
    } = pending;

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price_after_discount,
      0
    ) + shippingFee;

    const now = new Date();

    const newOrder = await Order.create({
      order_code: orderCode,
      user_id: user_id || null,
      shipping_info: {
        full_name: userInfo.fullName,
        phone: userInfo.phone,
        email: userInfo.email || null,
        address: userInfo.address,
      },
      order_date: now,
      delivery_date: deliveryDate,
      order_status_id: new mongoose.Types.ObjectId("60a4c8b2f9a2d3c4e5f6a881"),
      total_amount: totalAmount,
      payment_status: paymentMethod === "online" ? "Thanh toán trực tuyến qua VNPAY" : "Thanh toán khi nhận hàng",
      order_note: orderNote,
      create_at: now,
      update_at: now,
    });

    const orderDetails = orderItems.map((item) => ({
      order_id: newOrder._id,
      productdetail_id: new mongoose.Types.ObjectId(item.pdetail_id),
      quantity: item.quantity,
      price_at_order: item.price_after_discount,
    }));

    await OrderDetail.insertMany(orderDetails);

    for (const detail of orderDetails) {
      await ProductDetail.findByIdAndUpdate(
        detail.productdetail_id,
        {
          $inc: {
            inventory_number: -detail.quantity,
            sold_number: detail.quantity,
          },
          $set: { update_at: new Date() },
        }
      );
    }

    if (user_id && isFromCart) {
      const pdetail_ids = orderItems.map(item => item.pdetail_id);
      await CartItem.deleteMany({
        user_id: new mongoose.Types.ObjectId(user_id),
        pdetail_id: { $in: pdetail_ids.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }

    // Create notification
    await Notification.create({
      notification_type_id: new mongoose.Types.ObjectId("60a4c8b2f9a2d3c4e5f6a7e1"),
      message: `Khách hàng ${userInfo.fullName} vừa đặt đơn hàng mới với mã đơn hàng là ${orderCode} và đang chờ xác nhận`,
      related_id: newOrder._id,
      is_read: false,
      create_at: now,
      update_at: now,
    });

    if (userInfo.email) {
      const mailOptions = {
        from: `"TULY Shoe" <${process.env.EMAIL_USER}>`,
        to: userInfo.email,
        subject: `TULY Shoe - Xác nhận đơn hàng ${orderCode}`,
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
      <img src="https://duongvanluc2002.sirv.com/logo_den.png" width="200" alt="Logo" class="logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
      
      <h2 class="text-dark-mode" style="color: #333; text-align: center;">Cảm ơn bạn đã đặt hàng tại TULY Shoe!</h2>
      <p class="text-dark-mode" style="font-size: 16px; color: #555;">Xin chào <strong>${pending.userInfo.fullName}</strong>,</p>
      <p class="text-dark-mode" style="font-size: 16px; color: #555;">Chúng tôi đã nhận được đơn hàng <strong>${pending.order_code}</strong> của bạn.</p>

      <ul style="list-style: none; padding: 0; font-size: 16px; color: #555;">
        <li><strong>Phương thức thanh toán:</strong> Thanh toán trực tuyến qua VNPAY</li>
        <li><strong>Ngày đặt hàng:</strong> ${now.toLocaleDateString("vi-VN")}</li>
        <li><strong>Dự kiến giao:</strong> ${pending.deliveryDate.toLocaleDateString("vi-VN")}</li>
        <li><strong>Địa chỉ nhận:</strong> ${pending.userInfo.address}</li>
        <li><strong>Phí vận chuyển:</strong> ${pending.shippingFee.toLocaleString()} ₫</li>
        <li><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()} ₫</li>
        ${pending.orderNote
            ? `<li><strong>Ghi chú đơn hàng:</strong> ${pending.orderNote}</li>`
            : ""}
      </ul>

      <div style="margin: 20px 0;">
        <h3 style="font-size: 18px; color: #007bff;">Chi tiết sản phẩm:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th align="left" style="padding: 8px;">Sản phẩm</th>
              <th align="center" style="padding: 8px;">SL</th>
              <th align="right" style="padding: 8px;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${pending.orderItems.map(item => `
              <tr>
                <td style="padding: 8px;">${item.productName} (Size: ${item.size_name})</td>
                <td align="center" style="padding: 8px;">${item.quantity}</td>
                <td align="right" style="padding: 8px;">${(item.price_after_discount * item.quantity).toLocaleString()} ₫</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
      <p class="text-dark-mode" style="font-size: 14px; color: #777; text-align: center;">Nếu bạn có bất kỳ câu hỏi nào, hãy phản hồi email này để được hỗ trợ.</p>

      <div style="text-align: center; margin-top: 30px;">
        <p class="text-dark-mode" style="font-size: 14px; color: #777;">Trân trọng,</p>
        <p class="text-dark-mode" style="font-size: 14px; color: #777;">Đội ngũ TULY Shoe</p>
      </div>
    </div>
  </div>
`,
      };
      await transporter.sendMail(mailOptions);
    }

    await PendingOrder.deleteOne({ order_code: orderCode });

    return res.status(200).json({ RspCode: "00", Message: "Success" });
  } catch (err) {
    console.error("Lỗi IPN:", err);
    return res.status(500).json({ RspCode: "99", Message: "Unknown error" });
  }
};

exports.return = async (req, res) => {
  try {
    let vnpParams = req.query;
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const calculatedHash = createSecureHash(vnpParams);

    if (secureHash === calculatedHash) {
      const orderCode = vnpParams["vnp_TxnRef"];
      const vnpResponseCode = vnpParams["vnp_ResponseCode"];

      if (vnpResponseCode === "00") {
        return res.redirect(`https://tulyshoe-front.onrender.com/order-success?order_code=${orderCode}`);
      } else {
        return res.redirect("https://tulyshoe-front.onrender.com/order-failure");
      }
    } else {
      return res.redirect("https://tulyshoe-front.onrender.com/order-failure?error=checksum_failed");
    }
  } catch (err) {
    console.error("Lỗi khi xử lý return URL:", err);
    return res.redirect("https://tulyshoe-front.onrender.com/order-failure?error=server_error");
  }
};