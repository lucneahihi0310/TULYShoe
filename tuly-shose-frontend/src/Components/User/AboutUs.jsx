import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  notification,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import axios from "axios";
import styles from "../../CSS/AboutUs.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faHistory,
  faBullseye,
  faShieldAlt,
  faTruck,
  faUsers,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  const [form] = Form.useForm();
  const [loadingSupport, setLoadingSupport] = useState(false);

  const handleSupportSubmit = async (values) => {
    setLoadingSupport(true);
    try {
      const response = await axios.post(
        "http://localhost:9999/support/submit",
        values
      );
      notification.success({
        message: "Gửi yêu cầu thành công!",
        description: response.data.message,
        placement: "bottomRight",
        duration: 3,
      });
      form.resetFields();
    } catch (err) {
      notification.error({
        message: "Lỗi khi gửi yêu cầu",
        description:
          err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        placement: "bottomRight",
        duration: 3,
      });
    } finally {
      setLoadingSupport(false);
    }
  };

  const cards = [
    {
      icon: faHistory,
      title: "Câu Chuyện Của Chúng Tôi",
      content:
        "Được thành lập tại Việt Nam, TULY Shoe xuất phát từ niềm đam mê sneakers và mong muốn mang đến văn hóa sneaker thời thượng, sành điệu cho mọi người. Ban đầu là một cửa hàng nhỏ, chúng tôi đã phát triển thành thương hiệu uy tín với những thiết kế chất lượng và phong cách dẫn đầu xu hướng.",
    },
    {
      icon: faBullseye,
      title: "Sứ Mệnh",
      content:
        "Chúng tôi mong muốn giúp mỗi cá nhân thể hiện phong cách riêng qua đôi giày của mình. Sứ mệnh của TULY Shoe là cung cấp những đôi sneaker cao cấp, kết hợp giữa thiết kế hiện đại, sự thoải mái tối ưu và độ bền vượt trội – để bạn tự tin tỏa sáng mỗi ngày.",
    },
    {
      icon: faShieldAlt,
      title: "Chất Lượng Sản Phẩm",
      content:
        "Mỗi đôi giày tại TULY Shoe đều được lựa chọn kỹ lưỡng và kiểm tra nghiêm ngặt để đảm bảo tiêu chuẩn cao nhất. Chúng tôi hợp tác với các thương hiệu hàng đầu và nhà thiết kế uy tín nhằm mang đến sản phẩm với chất liệu bền bỉ, công nghệ tiên tiến và sự tinh xảo trong từng đường may.",
    },
    {
      icon: faTruck,
      title: "Chất Lượng Vận Chuyển",
      content:
        "TULY Shoe cam kết giao hàng nhanh chóng, an toàn và đúng hẹn. Chúng tôi sử dụng dịch vụ vận chuyển uy tín, đóng gói cẩn thận để đảm bảo sản phẩm đến tay khách hàng trong tình trạng hoàn hảo nhất, dù bạn ở bất cứ đâu trên toàn quốc.",
    },
    {
      icon: faUsers,
      title: "Cộng Đồng & Văn Hóa",
      content:
        "TULY Shoe không chỉ là cửa hàng mà còn là cộng đồng đam mê sneaker. Chúng tôi tổ chức các sự kiện, ra mắt sản phẩm độc quyền và hợp tác sáng tạo để kết nối bạn với xu hướng mới nhất và phong cách sống năng động, trẻ trung.",
    },
    {
      icon: faLeaf,
      title: "Cam Kết Bền Vững",
      content:
        "Chúng tôi hướng đến phát triển bền vững bằng cách hợp tác với các thương hiệu ưu tiên sử dụng vật liệu thân thiện môi trường và quy trình sản xuất có trách nhiệm. TULY Shoe mong muốn góp phần bảo vệ hành tinh mà không làm giảm đi chất lượng và phong cách.",
    },
  ];

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <section id="about" className={styles.aboutSection}>
        <Title level={2} className={styles.sectionTitle}>
          Giới <span className={styles.highlight}>Thiệu TULY Shoe</span>
        </Title>
        <Row gutter={[32, 32]} align="stretch">
          <Col xs={24} md={12}>
            <div className={styles.cardContainer}>
              {cards.map((card, index) => (
                <Card key={index} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <FontAwesomeIcon
                      icon={card.icon}
                      className={styles.cardIcon}
                    />
                    <Title level={3}>{card.title}</Title>
                  </div>
                  <Paragraph>{card.content}</Paragraph>
                </Card>
              ))}
            </div>
          </Col>
          <Col xs={24} md={12}>
            <img
              src="https://storage.googleapis.com/a1aa/image/50d7e2a9-5953-42c8-3edb-7c261c7d2707.jpg"
              alt="Cận cảnh đôi giày sneaker cao cấp"
              className={styles.image}
            />
          </Col>
        </Row>
      </section>

      <section id="contact" className={styles.contactSection}>
        <Title level={2} className={styles.sectionTitle}>
          Bạn Cần TULY Shoe Hỗ Trợ
        </Title>
        <Form
          form={form}
          name="contact"
          onFinish={handleSupportSubmit}
          layout="vertical"
          className={styles.form}
          aria-label="Form liên hệ của TULY Shoe"
        >
          <Form.Item
            label="Họ và Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Họ và tên của bạn" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Vui lòng nhập email hợp lệ!" },
            ]}
          >
            <Input
              placeholder="you@example.com"
              onChange={(e) =>
                form.setFieldsValue({ email: e.target.value.toLowerCase() })
              }
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!",
              },
            ]}
          >
            <Input placeholder="0xxxxxxxxx" maxLength={10} />
          </Form.Item>
          <Form.Item
            label="Nội dung yêu cầu"
            name="message"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea
              placeholder="Viết nội dung yêu cầu của bạn..."
              rows={5}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loadingSupport}
              disabled={loadingSupport}
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.contactInfo}>
          <Paragraph>
            <EnvironmentOutlined className={styles.contactIcon} />
            123 Đường Sneaker, Quận 1, TP. Hồ Chí Minh, Việt Nam
          </Paragraph>
          <Paragraph>
            <PhoneOutlined className={styles.contactIcon} />
            <a href="tel:+84123456789" className={styles.link}>
              +84 123 456 789
            </a>
          </Paragraph>
          <Paragraph>
            <MailOutlined className={styles.contactIcon} />
            <a href="mailto:contact@tulyshoe.com" className={styles.link}>
              contact@tulyshoe.com
            </a>
          </Paragraph>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com/tulyshoe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className={styles.socialIcon}
              />
            </a>
            <a
              href="https://instagram.com/tulyshoe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className={styles.socialIcon}
              />
            </a>
            <a
              href="https://twitter.com/tulyshoe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
