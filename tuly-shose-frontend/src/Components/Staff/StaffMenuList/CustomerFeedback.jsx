import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Image,
  Badge,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Card,
} from "react-bootstrap";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);

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

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Danh sách đánh giá</h3>
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
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>
                {review.userName}
              </td>
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
                {review.replies?.length > 0 ? (
                  <Accordion flush>
                    {review.replies.map((reply, i) => (
                      <Accordion.Item eventKey={i.toString()} key={i}>
                        <Accordion.Header>Phản hồi {i + 1}</Accordion.Header>
                        <Accordion.Body>
                          <p>
                            <strong>
                              {reply.replier_id?.first_name}{" "}
                              {reply.replier_id?.last_name}
                            </strong>
                          </p>
                          <p>{reply.reply_content}</p>
                          <small className="text-muted">
                            {new Date(reply.reply_date).toLocaleString()}
                          </small>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                ) : (
                  "Chưa có"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReviewTable;
