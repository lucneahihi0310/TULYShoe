import React from "react";
import { Typography, Row, Col, Table, List, Image } from "antd";
import styles from "../../CSS/Instruct.module.css";

const { Title, Paragraph } = Typography;

const sizeData = [
  { sizeVN: 38, footLength: 24.0, sizeUS: 6 },
  { sizeVN: 39, footLength: 24.5, sizeUS: 6.5 },
  { sizeVN: 40, footLength: 25.0, sizeUS: 7 },
  { sizeVN: 41, footLength: 25.5, sizeUS: 8 },
  { sizeVN: 42, footLength: 26.0, sizeUS: 8.5 },
  { sizeVN: 43, footLength: 26.5, sizeUS: 9 },
  { sizeVN: 44, footLength: 27.0, sizeUS: 10 },
];

const columns = [
  {
    title: "Size VN",
    dataIndex: "sizeVN",
    key: "sizeVN",
  },
  {
    title: "Chiều dài chân (cm)",
    dataIndex: "footLength",
    key: "footLength",
  },
  {
    title: "Size US",
    dataIndex: "sizeUS",
    key: "sizeUS",
  },
];

const Instruct = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* About Us Section */}
        <section id="about" className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Về TULY Shoe
          </Title>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Image
                src="https://storage.googleapis.com/a1aa/image/f8eac0c8-dd32-456d-a72e-74e41cee3eb4.jpg"
                alt="Hình ảnh giày sneaker hiện đại, phong cách trẻ trung của TULY Shoe, nền trắng sáng"
                className={styles.image}
                preview={false}
              />
            </Col>
            <Col xs={24} md={12}>
              <Paragraph className={styles.paragraph}>
                TULY Shoe là thương hiệu giày sneaker hàng đầu, mang đến cho bạn
                những đôi giày thời thượng, chất lượng và thoải mái nhất. Chúng
                tôi cam kết sử dụng nguyên liệu cao cấp cùng công nghệ sản xuất
                hiện đại để tạo ra sản phẩm bền bỉ, phù hợp với phong cách sống
                năng động và cá tính của bạn.
              </Paragraph>
              <Paragraph className={styles.paragraph}>
                Với sứ mệnh đồng hành cùng bạn trên mọi bước chân, TULY Shoe
                không chỉ chú trọng đến thiết kế mà còn đặc biệt quan tâm đến
                trải nghiệm khách hàng, từ việc chọn size chuẩn xác đến cách bảo
                quản và vệ sinh giày đúng cách.
              </Paragraph>
              <Paragraph className={styles.paragraph}>
                Hãy cùng TULY Shoe tạo nên phong cách riêng biệt và tự tin tỏa
                sáng mỗi ngày!
              </Paragraph>
            </Col>
          </Row>
        </section>

        {/* Size Guide Section */}
        <section id="size-guide" className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Hướng Dẫn Chọn Size Giày
          </Title>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Image
                src="https://duongvanluc2002.sirv.com/1.jpeg"
                alt="Hình ảnh hướng dẫn chọn size giày chi tiết với bảng đo chiều dài bàn chân và các kích cỡ tương ứng, nền trắng sáng"
                className={styles.image}
                preview={false}
              />
            </Col>
            <Col xs={24} md={12}>
              <Paragraph className={styles.paragraph}>
                Để chọn size giày phù hợp nhất, bạn hãy đo chiều dài bàn chân
                theo các bước sau:
              </Paragraph>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Đặt bàn chân lên tờ giấy trắng, giữ thăng bằng.",
                  "Dùng bút vẽ viền bàn chân chính xác.",
                  "Đo chiều dài từ gót chân đến đầu ngón dài nhất bằng thước.",
                  "Đối chiếu số đo với bảng size giày của TULY Shoe bên dưới.",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta description={item} />
                  </List.Item>
                )}
                className={styles.list}
              />
              <Paragraph className={styles.paragraph}>
                Nếu bạn nằm giữa 2 size, hãy chọn size lớn hơn để đảm bảo sự
                thoải mái khi mang.
              </Paragraph>
              <Paragraph className={styles.tableTitle}>
                Bảng quy đổi size (cm):
              </Paragraph>
              <Table
                dataSource={sizeData}
                columns={columns}
                pagination={false}
                className={styles.table}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? styles.evenRow : ""
                }
              />
            </Col>
          </Row>
        </section>

        {/* Care & Cleaning Guide Section */}
        <section id="care-guide" className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Hướng Dẫn Bảo Quản & Vệ Sinh Giày
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Title level={3} className={styles.subTitle}>
                <i className={`fas fa-shoe-prints ${styles.icon}`}></i> Bảo Quản
                Giày
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Giữ giày ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp làm phai màu và hư hỏng chất liệu.",
                  "Không để giày tiếp xúc với nước lâu ngày để tránh ẩm mốc và hư hại.",
                  "Sử dụng túi đựng giày hoặc hộp giày khi không sử dụng để bảo vệ khỏi bụi bẩn và va đập.",
                  "Thường xuyên thay đổi giày để giày có thời gian “nghỉ” và giữ form dáng tốt hơn.",
                  "Đặt giấy hút ẩm hoặc túi chống ẩm trong hộp giày để giữ giày luôn khô ráo.",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta description={item} />
                  </List.Item>
                )}
                className={styles.list}
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={3} className={styles.subTitle}>
                <i className={`fas fa-broom ${styles.icon}`}></i> Hướng Dẫn Vệ
                Sinh Giày
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Dùng bàn chải mềm hoặc khăn ẩm lau sạch bụi bẩn trên bề mặt giày.",
                  "Đối với giày vải, có thể giặt tay nhẹ nhàng với nước ấm và xà phòng nhẹ, tránh ngâm lâu.",
                  "Không sử dụng máy giặt để tránh làm biến dạng giày.",
                  "Để giày khô tự nhiên ở nơi thoáng mát, tránh ánh nắng trực tiếp và nguồn nhiệt cao.",
                  "Sử dụng sản phẩm bảo dưỡng chuyên dụng phù hợp với chất liệu giày để giữ độ bền và màu sắc.",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta description={item} />
                  </List.Item>
                )}
                className={styles.list}
              />
            </Col>
          </Row>
          <Row justify="center" className={styles.imageRow}>
            <Col xs={24} md={20}>
              <Image
                src="https://storage.googleapis.com/a1aa/image/8a2375a4-7254-4f58-f513-74bce4ed313b.jpg"
                alt="Hình ảnh minh họa vệ sinh giày sneaker với bàn chải mềm và dung dịch làm sạch, nền sáng, phong cách hiện đại"
                className={styles.image}
                preview={false}
              />
            </Col>
          </Row>
        </section>
      </main>
    </div>
  );
};

export default Instruct;
