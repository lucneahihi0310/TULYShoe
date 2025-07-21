import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Image,
  Badge,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/reviews/staff/review`);
        const data = await response.json();
        setReviews(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    };
    fetchReviews();
  }, []);

  // Lọc theo search và filter
  useEffect(() => {
    let filtered = [...reviews];

    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      const isApproved = statusFilter === "approved";
      filtered = filtered.filter((r) => r.is_approved === isApproved);
    }

    setFilteredReviews(filtered);
    setCurrentPage(1); // Reset page về 1 khi filter
  }, [searchTerm, statusFilter, reviews]);

  // Phân trang
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Danh sách đánh giá</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Tìm kiếm bên trái */}
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter bên phải */}
        <div style={{ maxWidth: "180px" }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
          </select>

        </div>
      </div>


      <Table bordered responsive hover>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Người đánh giá</th>
            <th>Nội dung</th>
            <th>Hình ảnh</th>
            <th>Rating</th>
            <th>Mã đơn hàng</th>
            <th>Ngày đánh giá</th>
            <th>Trạng thái</th>
            <th>Phản hồi</th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                Không có đánh giá nào phù hợp.
              </td>
            </tr>
          ) : (
            currentReviews.map((review, index) => (
              <tr key={review._id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{review.userName}</td>
                <td>{review.review_content}</td>
                <td>
                  {review.images?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {review.images.map((img, i) => (
                        <OverlayTrigger
                          key={i}
                          placement="top"
                          overlay={<Tooltip>Ảnh {i + 1}</Tooltip>}
                        >
                          <Image
                            src={img}
                            rounded
                            thumbnail
                            style={{ width: 60, height: 60, objectFit: "cover" }}
                          />
                        </OverlayTrigger>
                      ))}
                    </div>
                  ) : (
                    "Không có"
                  )}
                </td>
                <td>
                  <Badge bg="warning" text="dark">
                    {review.rating} ★
                  </Badge>
                </td>
                <td>{review.ordetail_id?.order_id || "Không có"}</td>
                <td>{new Date(review.review_date).toLocaleDateString()}</td>
                <td>
                  {review.is_approved ? (
                    <Badge bg="success">Đã duyệt</Badge>
                  ) : (
                    <Badge bg="secondary">Chờ duyệt</Badge>
                  )}
                </td>
                <td>
                  <td style={{ minWidth: "180px" }}>
  {review.replies ? (
    Array.isArray(review.replies) ? (
      review.replies.map((reply, i) => (
        <div key={i} className="mb-2 border rounded p-2 bg-light">
          <strong>{reply.replier || "Ẩn danh"}:</strong>
          <div>{reply.reply_content}</div>
          <small className="text-muted">
            {new Date(reply.reply_date).toLocaleString()}
          </small>
        </div>
      ))
    ) : (
      <div className="border rounded p-2 bg-light">
        <strong>{review.replies.replier || "Ẩn danh"}:</strong>
        <div>{review.replies.reply_content}</div>
        <small className="text-muted">
          {new Date(review.replies.reply_date).toLocaleString()}
        </small>
      </div>
    )
  ) : (
    <span className="text-muted">Chưa có</span>
  )}
</td>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
};

export default ReviewTable;
