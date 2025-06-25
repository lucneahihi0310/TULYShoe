const Review = require("../models/review.model");

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