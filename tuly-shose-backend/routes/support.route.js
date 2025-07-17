const express = require("express");
const router = express.Router();
const supportController = require("../controllers/support.controller");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Tối đa 5 yêu cầu mỗi IP
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.",
});

router.post("/submit", limiter, supportController.submitSupportForm);
router.get("/check-cooldown", supportController.checkCooldown);
module.exports = router;