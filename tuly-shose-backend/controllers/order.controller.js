const Order = require("../models/order.model");
const OrderDetail = require("../models/oderDetail.model");
const CartItem = require("../models/cartItem.model");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require('../models/account.modle');
const OrderStatus = require("../models/orderStatus.model");
require("../models/account.modle");
require("../models/address_shipping.model");

const DEFAULT_ORDER_STATUS_ID = "60a4c8b2f9a2d3c4e5f6a881";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, userInfo, paymentMethod, orderNote, shippingFee, user_id } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ." });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price_after_discount,
      0
    );

    const isHanoi = userInfo.address?.toLowerCase().includes("hà nội");
    const deliveryDays = isHanoi ? 3 : 5;
    const now = new Date();
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + deliveryDays);

    const orderCode = `TULY-${Date.now()}`;

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
      order_status_id: new mongoose.Types.ObjectId(DEFAULT_ORDER_STATUS_ID),
      total_amount: totalAmount + shippingFee,
      payment_status: paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán trực tuyến",
      order_note: orderNote,
      create_at: now,
      update_at: now,
    });

    const orderDetails = orderItems.map((item) => {
      if (!item.pdetail_id) {
        console.warn("Thiếu pdetail_id ở item:", item);
        throw new Error("Thiếu pdetail_id trong danh sách sản phẩm.");
      }

      return {
        order_id: newOrder._id,
        productdetail_id: new mongoose.Types.ObjectId(item.pdetail_id),
        quantity: item.quantity,
        price_at_order: item.price_after_discount,
      };
    });

    await OrderDetail.insertMany(orderDetails);


    if (user_id) {
      await CartItem.deleteMany({ user_id: new mongoose.Types.ObjectId(user_id) });
    }



    if (userInfo.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
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
          <img src="https://duongvanluc2002.sirv.com/logo_den.png" width="200" height="auto" alt="Logo" class="logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
          
          <h2 class="text-dark-mode" style="color: #333; text-align: center;">Cảm ơn bạn đã đặt hàng tại TULY Shoe!</h2>
          <p class="text-dark-mode" style="font-size: 16px; color: #555;">Xin chào <strong>${userInfo.fullName}</strong>,</p>
          <p class="text-dark-mode" style="font-size: 16px; color: #555;">Chúng tôi đã nhận được đơn hàng <strong>${orderCode}</strong> của bạn.</p>

          <ul style="list-style: none; padding: 0; font-size: 16px; color: #555;">
            <li><strong>Phương thức thanh toán:</strong> ${paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán trực tuyến"}</li>
            <li><strong>Ngày đặt hàng:</strong> ${now.toLocaleDateString("vi-VN")}</li>
            <li><strong>Dự kiến giao:</strong> ${deliveryDate.toLocaleDateString("vi-VN")}</li>
            <li><strong>Địa chỉ nhận:</strong> ${userInfo.address}</li>
            <li><strong>Phí vận chuyển:</strong> ${(shippingFee).toLocaleString()} ₫</li>
            <li><strong>Tổng tiền:</strong> ${(totalAmount + shippingFee).toLocaleString()} ₫</li>
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
                ${orderItems
            .map(
              (item) => `
                  <tr>
                    <td style="padding: 8px;">${item.productName} (Size: ${item.size_name})</td>
                    <td align="center" style="padding: 8px;">${item.quantity}</td>
                    <td align="right" style="padding: 8px;">${(item.price_after_discount * item.quantity).toLocaleString()} ₫</td>
                  </tr>
                `
            )
            .join("")}
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

    return res.status(201).json({
      message: "Đặt hàng thành công!",
      order_code: orderCode,
    });
  } catch (err) {
    console.error("Lỗi khi tạo đơn hàng:", err);
    return res.status(500).json({ message: "Lỗi server khi xử lý đơn hàng." });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('order_status_id')
            .populate('accepted_by')
            .populate('user_id');

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            userName: order.shipping_info.full_name,
            order_code: order.order_code,
            order_date: order.order_date,
            order_status: order.order_status_id ? order.order_status_id.order_status_name : 'Không có trạng thái',
            address_shipping: order.shipping_info.address,
            delivery_date: order.delivery_date,
            order_note: order.order_note,
            total_amount: order.total_amount,
            payment_status: order.payment_status,
            accepted_by: order.accepted_by ? `${order.accepted_by.first_name} ${order.accepted_by.last_name}` : null,
            create_at: order.create_at,
            update_at: order.update_at
        }));

        res.status(200).json({
            success: true,
            formattedOrders
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { staffId } = req.body;

    const staff = await User.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Nhân viên không tồn tại' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

    if (order.accepted_by) return res.status(400).json({ message: 'Đơn hàng đã xác nhận' });

    // 🔽 Tìm ID trạng thái \"Đã xác nhận\"
    const confirmedStatus = await OrderStatus.findOne({ order_status_name: "Đã xác nhận" });
    if (!confirmedStatus) return res.status(404).json({ message: 'Không tìm thấy trạng thái Đã xác nhận' });

    // ✅ Cập nhật đơn hàng
    order.accepted_by = staffId;
    order.order_status_id = confirmedStatus._id;
    order.update_at = Date.now();
    await order.save();

    res.status(200).json({ message: 'Xác nhận đơn hàng thành công', order });
  } catch (error) {
    console.error('Lỗi xác nhận đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatusName } = req.body;

    if (!newStatusName) {
      return res.status(400).json({ message: "Thiếu tên trạng thái mới" });
    }

    // Tìm trạng thái mới trong bảng OrderStatus
    const newStatus = await OrderStatus.findOne({ order_status_name: newStatusName });

    if (!newStatus) {
      return res.status(404).json({ message: `Không tìm thấy trạng thái: ${newStatusName}` });
    }

    // Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Cập nhật trạng thái
    order.order_status_id = newStatus._id;
    order.update_at = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng thành: ${newStatusName}`,
      order
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};