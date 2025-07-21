import React, { useState, useContext } from "react";
import { AuthContext } from "../../API/AuthContext";
import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

const ReviewReplyCell = ({ review, onReplySuccess }) => {
  const { user } = useContext(AuthContext);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      setError("Nội dung không được để trống.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${BASE_URL}/reviews/staff/${review._id}/reply`, {
        replier_id: user._id,
        reply_content: replyContent,
      });
      setError("");
      setShowForm(false);
      setReplyContent("");

      // Gọi lại cha để reload dữ liệu
      onReplySuccess?.();
    } catch (err) {
      console.error("Lỗi gửi phản hồi:", err);
      setError("Không thể gửi phản hồi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Nếu đã có phản hồi rồi
  if (review.replies && review.replies.reply_content) {
    return (
      <div className="border rounded p-2 bg-light">
        <strong>{review.replies.replier || "Ẩn danh"}:</strong>
        <div>{review.replies.reply_content}</div>
        <small className="text-muted">
          {new Date(review.replies.reply_date).toLocaleString()}
        </small>
      </div>
    );
  }

  // Nếu chưa có phản hồi, hiện nút "Phản hồi"
  if (!showForm) {
    return (
      <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
        Phản hồi
      </button>
    );
  }

  // Hiển thị form phản hồi
  return (
    <div >
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Nhập nội dung phản hồi..."
        rows={3}
        style={{ width: "100%", marginBottom: "6px" }}
      />
      {error && <div className="text-danger" style={{ marginBottom: "4px" }}>{error}</div>}
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleReplySubmit}
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi phản hồi"}
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            setShowForm(false);
            setReplyContent("");
            setError("");
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default ReviewReplyCell;
