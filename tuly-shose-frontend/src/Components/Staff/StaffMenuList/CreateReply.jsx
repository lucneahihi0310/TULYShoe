import React, { useState, useContext } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { format } from "date-fns";
import { AuthContext } from "../../API/AuthContext";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

const ReviewReplyCell = ({ review, onReplySuccess }) => {
  const { user } = useContext(AuthContext);
  const [replyContent, setReplyContent] = useState(review.replies?.reply_content || "");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const isOwnReply =
    review.replies?.replier_id === user._id || review.replies?.replier_id?._id === user._id;

  const handleSubmitReply = async () => {
  const trimmed = replyContent.trim();
  if (!trimmed) {
    toast.error("Vui lòng nhập nội dung phản hồi");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/reviews/staff/${review._id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        replier_id: user._id,
        reply_content: trimmed,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Lỗi phản hồi:", data);
      toast.error(data.message || "Phản hồi thất bại.");
      return;
    }

    toast.success("Phản hồi thành công.");
    setShowReplyForm(false);
    setReplyContent("");
    onReplySuccess?.();
  } catch {
    toast.error("Lỗi khi gửi phản hồi.");
  }
};


const handleUpdateReply = async () => {
  const trimmed = replyContent.trim();

  if (!trimmed) {
    toast.error("Nội dung phản hồi không được để trống");
    return;
  }

  const original = (review.replies.reply_content || "").trim();
  if (trimmed === original) {
    toast.info("Nội dung không thay đổi");
    setEditing(false);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/reviews/staff/${review._id}/reply`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        replier_id: user._id,
        reply_content: trimmed,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Cập nhật phản hồi thất bại");

    toast.success("Cập nhật phản hồi thành công");
    setEditing(false);
    onReplySuccess?.();
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    toast.error("Lỗi khi cập nhật phản hồi");
  }
};




  const handleDeleteReply = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá phản hồi?")) return;

    try {
      const response = await fetch(`${BASE_URL}/reviews/staff/${review._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xoá phản hồi thành công");
        onReplySuccess?.();
      } else {
        toast.error("Không thể xoá phản hồi");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ khi xoá phản hồi");
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-3">
      <Card.Body>
        {review.replies?.reply_content ? (
          <>
            <strong className="d-block mb-2">
              {isOwnReply ? "Tôi" : review.replies.replier || "Nhân viên"}:
            </strong>

            {editing ? (
              <>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2 gap-2">
                  <Button size="sm" variant="primary" onClick={handleUpdateReply}>
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                      setReplyContent(review.replies.reply_content);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-1">{review.replies.reply_content}</p>
                <small className="text-muted">
                  {review.replies.reply_date
                    ? format(new Date(review.replies.reply_date), "HH:mm:ss dd/MM/yyyy")
                    : <em className="text-danger">Không có ngày phản hồi</em>}
                </small>

                {isOwnReply && (
                  <div className="mt-2 d-flex gap-3">
                    <Button variant="link" size="sm" onClick={() => setEditing(true)}>
                      Sửa
                    </Button>
                    <Button variant="link" size="sm" className="text-danger" onClick={handleDeleteReply}>
                      Xoá
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {!showReplyForm ? (
              <Button variant="outline-primary" size="sm" onClick={() => setShowReplyForm(true)}>
                Phản hồi
              </Button>
            ) : (
              <>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2 gap-2">
                  <Button size="sm" variant="success" onClick={handleSubmitReply}>
                    Gửi
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent("");
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewReplyCell;
