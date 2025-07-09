const Review = require("../models/review.modle");
const OrderDetail = require("../models/oderDetail.model");

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user_id", "username")
            .populate("ordetail_id", "order_id")
            .populate("replies.replier_id", "username");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
}
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("user_id", "username")
            .populate("ordetail_id", "order_id")
            .populate("replies.replier_id", "username");
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Error fetching review", error: error.message });
    }
}

exports.getReviewsByProductDetailId = async (req, res) => {
  try {
    const productDetailId = req.params.detailId;

    const orderDetails = await OrderDetail.find({
      productdetail_id: productDetailId,
    }).select("_id");

    const orderDetailIds = orderDetails.map((od) => od._id);

    if (!orderDetailIds.length) {
      return res.status(200).json([]); // Không có đơn hàng nào
    }

    const reviews = await Review.find({
      ordetail_id: { $in: orderDetailIds },
      is_approved: true,
    })
      .populate("user_id", "first_name last_name avatar_image")
      .populate("replies.replier_id", "first_name last_name avatar_image");

    res.json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy review:", error);
    res.status(500).json({ message: "Lỗi khi lấy đánh giá", error: error.message });
  }
};

