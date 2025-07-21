import React, { useState, useContext } from "react";
import { format } from "date-fns";
import { AuthContext } from '../../API/AuthContext';
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
    review.replies?.replier_id === user._id ||
    review.replies?.replier_id?._id === user._id;

  const handleSubmitReply = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reviews/staff/${review._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replier_id: user._id,
          reply_content: replyContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Phản hồi thành công.");
        setShowReplyForm(false);
        setReplyContent("");
        onReplySuccess?.();
      } else {
        toast.error(data.message || "Phản hồi thất bại.");
      }
    } catch (error) {
      toast.error("Lỗi khi gửi phản hồi.");
    }
  };

  const handleUpdateReply = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reviews/staff/${review._id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply_content: replyContent,
          replier_id: user._id,
        }),
      });

      const updatedReply = await response.json();

      if (!response.ok) {
        throw new Error(updatedReply.message || "Cập nhật phản hồi thất bại");
      }

      toast.success("Cập nhật phản hồi thành công");
      setEditing(false);
    onReplySuccess?.();   
} catch (error) {
      console.error("Lỗi khi cập nhật phản hồi:", error);
      toast.error("Lỗi khi cập nhật phản hồi");
    }
  };

  return (
    <div className="border rounded p-3 mb-4 bg-white shadow-sm">
      {review.replies && review.replies.reply_content ? (
        <div className="bg-gray-100 rounded p-3">
          <p className="text-sm font-semibold">
            {isOwnReply ? "Tôi" : review.replies.replier || "Nhân viên"}:
          </p>

          {editing ? (
  <>
    <div className="flex flex-col gap-2">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="w-full p-2 border rounded text-sm"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={handleUpdateReply}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Lưu
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setReplyContent(review.replies.reply_content);
          }}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </div>
  </>
) : (
  <>
    <p className="text-sm">{review.replies.reply_content}</p>
    <p className="text-xs text-gray-500">
      {review.replies.reply_date ? (
        format(new Date(review.replies.reply_date), "HH:mm:ss dd/MM/yyyy")
      ) : (
        <span className="italic text-red-500">Không có ngày phản hồi</span>
      )}
    </p>
    {isOwnReply && (
      <button
        onClick={() => setEditing(true)}
        className="text-blue-600 text-sm mt-1 hover:underline"
      >
        Sửa
      </button>
    )}
  </>
)}

        </div>
      ) : (
        <div className="mt-2">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Phản hồi
            </button>
          ) : (
            <div className="mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
              <div className="flex justify-end mt-1 space-x-2">
                <button
                  onClick={handleSubmitReply}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Gửi phản hồi
                </button>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  className="text-gray-500 text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewReplyCell;
