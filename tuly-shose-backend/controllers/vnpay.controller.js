const crypto = require("crypto");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Order = require("../models/order.model");
const OrderDetail = require("../models/oderDetail.model");
const CartItem = require("../models/cartItem.model");
const ProductDetail = require("../models/productDetail.model");

const DEFAULT_ORDER_STATUS_ID = "60a4c8b2f9a2d3c4e5f6a881"; // chờ xác nhận
const PAID_STATUS_ID = "60a4c8b2f9a2d3c4e5f6a882";
const FAILED_STATUS_ID = "60a4c8b2f9a2d3c4e5f6a883";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const vnp_TmnCode = "IQGVN28J";
const vnp_HashSecret = "2OM8RGUD4LTEEVIG2CLEVHEA2BFEPTOK";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "https://tulyshoe.onrender.com/vnpay/return";

const PendingOrders = new Map();

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

function createSecureHash(data) {
  const sortedData = sortObject(data);
  const signData = Object.keys(sortedData)
    .map((key) => `${key}=${encodeURIComponent(sortedData[key]).replace(/%20/g, "+")}`)
    .join("&");
  return crypto.createHmac("sha512", vnp_HashSecret).update(signData).digest("hex");
}

function generateOrderEmailHTML(orderCode, userInfo, items, shippingFee, total, now, deliveryDate, orderNote) {
  return `
  <div style="font-family: Arial; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
      <img src="https://duongvanluc2002.sirv.com/logo_den.png" width="200" style="display: block; margin: auto;">
      <h2 style="text-align: center; color: #333;">Cảm ơn bạn đã đặt hàng tại TULY Shoe!</h2>
      <p>Xin chào <strong>${userInfo.fullName}</strong>,</p>
      <p>Chúng tôi đã nhận được đơn hàng <strong>${orderCode}</strong>.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Phương thức thanh toán:</strong> Đã thanh toán</li>
        <li><strong>Ngày đặt hàng:</strong> ${now.toLocaleDateString("vi-VN")}</li>
        <li><strong>Dự kiến giao:</strong> ${deliveryDate.toLocaleDateString("vi-VN")}</li>
        <li><strong>Địa chỉ nhận:</strong> ${userInfo.address}</li>
        <li><strong>Phí vận chuyển:</strong> ${shippingFee.toLocaleString()} ₫</li>
        <li><strong>Tổng tiền:</strong> ${total.toLocaleString()} ₫</li>
        ${orderNote ? `<li><strong>Ghi chú đơn hàng:</strong> ${orderNote}</li>` : ""}
      </ul>
      <h3>Chi tiết sản phẩm:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #eee;">
            <th align="left">Sản phẩm</th><th>SL</th><th align="right">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td>${i.productName} (Size: ${i.size_name})</td>
              <td align="center">${i.quantity}</td>
              <td align="right">${(i.quantity * i.price_after_discount).toLocaleString()} ₫</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

exports.createPayment = async (req, res) => {
  try {
    const { orderItems, userInfo, paymentMethod, orderNote, shippingFee, user_id, isFromCart } = req.body;
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ." });

    const orderCode = `TULY-${Date.now()}`;
    PendingOrders.set(orderCode, { orderItems, userInfo, paymentMethod, orderNote, shippingFee, user_id, isFromCart });

    const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price_after_discount, 0) + shippingFee;
    const createDate = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Amount: total * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toán đơn hàng ${orderCode}`,
      vnp_OrderType: "250000",
      vnp_Locale: "vn",
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
      vnp_ReturnUrl,
    };
    vnpParams.vnp_SecureHash = createSecureHash(vnpParams);

    const queryString = new URLSearchParams(sortObject(vnpParams)).toString();
    res.json({ message: "Tạo liên kết thành công", paymentUrl: `${vnp_Url}?${queryString}`, order_code: orderCode });
  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({ message: "Lỗi server khi tạo liên kết thanh toán." });
  }
};

exports.ipn = async (req, res) => {
  try {
    let vnpParams = req.query;
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;
    const isValid = secureHash === createSecureHash(vnpParams);
    if (!isValid) return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });

    const orderCode = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;
    const pending = PendingOrders.get(orderCode);

    if (responseCode !== "00" || !pending) return res.status(404).json({ RspCode: "01", Message: "Order not found or failed" });

    const { orderItems, userInfo, paymentMethod, orderNote, shippingFee, user_id, isFromCart } = pending;
    const now = new Date();
    const isHanoi = userInfo.address.toLowerCase().includes("hà nội");
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + (isHanoi ? 3 : 5));

    const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price_after_discount, 0) + shippingFee;

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
      order_status_id: new mongoose.Types.ObjectId(PAID_STATUS_ID),
      total_amount: total,
      payment_status: "Đã thanh toán",
      order_note: orderNote,
      create_at: now,
      update_at: now,
    });

    const details = orderItems.map(item => ({
      order_id: newOrder._id,
      productdetail_id: item.pdetail_id,
      quantity: item.quantity,
      price_at_order: item.price_after_discount
    }));
    await OrderDetail.insertMany(details);

    for (const item of orderItems) {
      await ProductDetail.findByIdAndUpdate(item.pdetail_id, {
        $inc: {
          sold_number: item.quantity,
          inventory_number: -item.quantity
        }
      });
    }

    if (user_id && isFromCart) {
      await CartItem.deleteMany({ user_id });
    }

    if (userInfo.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userInfo.email,
        subject: `TULY Shoe - Xác nhận đơn hàng ${orderCode}`,
        html: generateOrderEmailHTML(orderCode, userInfo, orderItems, shippingFee, total, now, deliveryDate, orderNote)
      });
    }

    PendingOrders.delete(orderCode);
    res.status(200).json({ RspCode: "00", Message: "Success" });
  } catch (err) {
    console.error("IPN error:", err);
    res.status(500).json({ RspCode: "99", Message: "Unknown error" });
  }
};

exports.return = (req, res) => {
  const vnpParams = req.query;
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const isValid = secureHash === createSecureHash(vnpParams);
  const orderCode = vnpParams.vnp_TxnRef;
  const responseCode = vnpParams.vnp_ResponseCode;

  if (!isValid) return res.redirect("https://tulyshoe-front.onrender.com/order-failure?error=checksum_failed");
  if (responseCode === "00") return res.redirect(`https://tulyshoe-front.onrender.com/order-success?order_code=${orderCode}`);
  return res.redirect("https://tulyshoe-front.onrender.com/order-failure");
};
