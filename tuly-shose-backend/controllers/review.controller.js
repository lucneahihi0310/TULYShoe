const Review = require("../models/review.modle");
const OrderDetail = require("../models/oderDetail.model");

exports.createOrUpdateReview = async (req, res) => {
  try {
    const userId = req.customerId._id;
    const { ordetail_id, productdetail_id, rating, review_content } = req.body;

    if (!ordetail_id || !productdetail_id || !rating || !review_content) {
      return res.status(400).json({ message: "Thiếu thông tin đánh giá!" });
    }

    // Kiểm tra quyền và trạng thái đơn hàng
    const orderDetail = await OrderDetail.findById(ordetail_id).populate({
      path: "order_id",
      populate: {
        path: "order_status_id",
        select: "order_status_name",
      },
      select: "user_id order_status_id",
    });

    if (
      !orderDetail ||
      String(orderDetail.order_id.user_id) !== String(userId) ||
      orderDetail.order_id.order_status_id?.order_status_name !== "Hoàn thành"
    ) {
      return res.status(403).json({ message: "Bạn chưa thể đánh giá sản phẩm này." });
    }

    // Lấy ảnh cũ từ body (nếu có)
    const oldImages = req.body.images_old;
    let imagesOld = [];

    if (Array.isArray(oldImages)) {
      imagesOld = oldImages;
    } else if (typeof oldImages === "string") {
      imagesOld = [oldImages];
    }

    // Lấy ảnh mới từ upload (nếu có)
    const imagesNew = req.files?.map((file) => file.path) || [];

    // Gộp ảnh cũ và mới (tối đa 3 ảnh)
    const combinedImages = [...imagesOld, ...imagesNew].slice(0, 3);

    // Cập nhật nếu đã tồn tại
    const existing = await Review.findOne({ ordetail_id, user_id: userId });

    if (existing) {
      existing.rating = rating;
      existing.review_content = review_content;
      existing.images = combinedImages;
      existing.update_at = new Date();
      await existing.save();

      return res.json({
        message: "Cập nhật đánh giá thành công!",
        review: existing,
      });
    }

    // Tạo đánh giá mới nếu chưa có
    const newReview = new Review({
      user_id: userId,
      ordetail_id,
      productdetail_id,
      review_content,
      rating,
      images: combinedImages,
      review_date: new Date(),
      is_approved: true,
    });

    await newReview.save();

    await OrderDetail.findByIdAndUpdate(ordetail_id, {
      review: newReview._id,
    });

    res.status(201).json({ message: "Đánh giá thành công!", review: newReview });
  } catch (error) {
    console.error("Lỗi đánh giá:", error);
    res.status(500).json({ message: "Lỗi server khi đánh giá", error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user_id", "username")
      .populate("ordetail_id", "order_id")
      .populate("replies.replier_id", "username");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá", error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user_id", "username")
      .populate("ordetail_id", "order_id")
      .populate("replies.replier_id", "username");
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đánh giá", error: error.message });
  }
};

exports.getReviewsByProductDetailId = async (req, res) => {
  try {
    const productDetailId = req.params.detailId;

    const orderDetails = await OrderDetail.find({
      productdetail_id: productDetailId,
    }).select("_id");

    const orderDetailIds = orderDetails.map((od) => od._id);

    if (!orderDetailIds.length) {
      return res.status(200).json([]);
    }

    const reviews = await Review.find({
      ordetail_id: { $in: orderDetailIds },
      is_approved: true,
    })
      .populate("user_id", "first_name last_name avatar_image")
      .populate("replies.replier_id", "first_name last_name avatar_image");

    res.json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    res.status(500).json({ message: "Lỗi khi lấy đánh giá", error: error.message });
  }
};

exports.getRandomReviews = async (req, res) => {
  try {
    const { rating = 5, limit = 3 } = req.query;

    const reviews = await Review.aggregate([
      { $match: { rating: parseInt(rating), is_approved: true } },
      {
        $group: {
          _id: '$user_id',
          review: { $first: '$$ROOT' },
        },
      },
      { $sample: { size: parseInt(limit) } },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'user_id',
        },
      },
      { $unwind: { path: '$user_id', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: '$review._id',
          user_id: {
            first_name: '$user_id.first_name',
            last_name: '$user_id.last_name',
            avatar_image: '$user_id.avatar_image',
          },
          review_content: '$review.review_content',
        },
      },
    ]);

    res.json(reviews);
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá ngẫu nhiên:', error);
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá ngẫu nhiên', error: error.message });
  }
};

exports.getReview = async (req, res) => {
  try {
    const reviews = await Review.find()
  .populate({
    path: "user_id",
    select: "first_name last_name"
  })
  .populate({
    path: "ordetail_id",
    select: "order_id",
    populate: {
      path: "order_id", // từ trong OrderDetail
      select: "order_code" // trong bảng Order có field này đúng chứ?
    }
  })
  .populate({
    path: "replies.replier_id", 
    select: "first_name last_name"
  })
  .select("_id review_content images rating review_date is_approved create_at update_at replies")
  .lean(); // chuyển sang object JS để dễ xử lý

  const formatted = reviews.map((review) => ({
  _id: review._id,
  userName: `${review.user_id?.first_name || ""} ${review.user_id?.last_name || ""}`,
  review_content: review.review_content,
  images: review.images,
  rating: review.rating,
  review_date: review.review_date,
  is_approved: review.is_approved,
  create_at: review.create_at,
  update_at: review.update_at,
  replies: review.replies?.map(reply => ({
    reply_content: reply.reply_content,
    reply_date: reply.reply_date,
    replier: reply.replier_id
      ? `${reply.replier_id.first_name} ${reply.replier_id.last_name}`
      : "Ẩn danh"
  })),
  order_code: review.ordetail_id?.order_id?.order_code || null,
}));


    res.status(200).json(formatted);
  } catch (error) {
console.error("Lỗi lấy đánh giá:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đánh giá." });  }
};