import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import styles from '../../CSS/HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fadeSlides = document.querySelectorAll(`.${styles.fadeSlide}`);
    fadeSlides.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(styles.show);
      }, index * 300); // Staggered delays: 300ms, 600ms, 900ms, 1200ms
    });
  }, []);

  const collections = [
    {
      title: "Men's Classic Leather",
      description: "Sự thanh lịch vượt thời gian với chất liệu da cao cấp và tay nghề thủ công điêu luyện.",
      price: "1.000.000 đ",
      image: "https://storage.googleapis.com/a1aa/image/62149467-4c0f-420b-b318-225d32b6e597.jpg",
      alt: "Men's classic leather shoes in dark brown color with elegant stitching and polished finish, displayed on a wooden surface",
    },
    {
      title: "Women's Elegant Heels",
      description: "Thiết kế tinh tế hoàn hảo cho những dịp đặc biệt và trang phục buổi tối.",
      price: "1.500.000 đ",
      image: "https://storage.googleapis.com/a1aa/image/b93b7551-a70e-47b6-2801-4e6804975b52.jpg",
      alt: "Women's elegant high-heeled shoes in glossy red with pointed toes and delicate ankle straps, placed on a marble floor",
    },
    {
      title: "Unisex Sport Sneakers",
      description: "Sự thoải mái kết hợp với phong cách nhờ vật liệu nhẹ và thiết kế hiện đại.",
      price: "9.500.000 đ",
      image: "https://storage.googleapis.com/a1aa/image/c188083b-617e-482e-47aa-5657a98bee60.jpg",
      alt: "Unisex sport sneakers in white and blue with breathable mesh and cushioned sole, ideal for running and casual wear",
    },
    {
      title: "Kids Colorful Casual",
      description: "Giày vui nhộn và bền được thiết kế để tạo sự thoải mái và vui chơi.",
      price: "5.000.000 đ",
      image: "https://storage.googleapis.com/a1aa/image/128922c8-b523-443a-ab26-70447bca9600.jpg",
      alt: "Kids colorful casual shoes with vibrant blue, yellow, and red accents, featuring velcro straps and flexible soles for active children",
    },
  ];

  const testimonials = [
    {
      name: "Linh Tran",
      role: "Người mua đã xác minh",
      comment: "Giày TULY mang đến sự kết hợp hoàn hảo giữa phong cách và sự thoải mái. Thương hiệu tôi lựa chọn cho mọi dịp!",
      image: "https://storage.googleapis.com/a1aa/image/4d20cc03-bf1f-45f0-adf9-13c02ee8c121.jpg",
      alt: "Portrait of a smiling young Asian woman with short hair, wearing a white blouse",
    },
    {
      name: "James Miller",
      role: "Người mua đã xác minh",
      comment: "Tay nghề thủ công thật xuất sắc. Đôi giày này bền lâu và trông tuyệt đẹp.",
      image: "https://storage.googleapis.com/a1aa/image/ef6d2e9a-9f8e-4668-3456-3574236aafb0.jpg",
      alt: "Portrait of a middle-aged Caucasian man with beard and glasses, wearing a casual shirt",
    },
    {
      name: "Amina Johnson",
      role: "Người mua đã xác minh",
      comment: "Tôi thích sự đa dạng và màu sắc rực rỡ. Đôi giày hoàn hảo cho lối sống năng động của tôi.",
      image: "https://storage.googleapis.com/a1aa/image/9932c1a1-1a20-4a49-a944-f9d6fd5f8f32.jpg",
      alt: "Portrait of a young African woman with natural hair, smiling and wearing a colorful top",
    },
  ];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} ${styles.fadeSlide} ${styles.delay2}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Bước vào thế giới sang trọng
                <br />
                cùng <span className={styles.brandHighlight}>TULY Shoe</span>
              </h1>
              <p className={styles.heroDescription}>
                Khám phá những đôi giày chất lượng cao được chế tác theo phong cách, sự thoải mái và thanh lịch. Nâng tầm vẻ ngoài của bạn với bộ sưu tập độc quyền của chúng tôi.
              </p>
              <Button type="primary" onClick={() => navigate("/products")} className={styles.shopButton}>
                Mua Ngay
              </Button>
            </div>
            <div className={styles.heroImageContainer}>
              <img
                src="https://duongvanluc2002.sirv.com/assets_task_01jz1qebawfxd93jd33dcfxgq5_1751331118_img_0.webp"
                alt="Luxury leather shoe with sleek design on a clean white background, showcasing premium craftsmanship and elegant style"
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
        <svg className={styles.heroWave} viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L1440 0V120H0Z" fill="#f9fafb" />
        </svg>
      </section>

      {/* Collections Section */}
      <section id="collections" className={`${styles.collectionsSection} ${styles.fadeSlide} ${styles.delay3}`}>
        <h2 className={styles.sectionTitle}>Sản Phẩm Bán Chạy</h2>
        <div className={styles.collectionsGrid}>
          {collections.map((item, index) => (
            <div key={index} className={styles.collectionItem}>
              <img
                src={item.image}
                alt={item.alt}
                className={styles.collectionImage}
              />
              <div className={styles.collectionDetails}>
                <h3 className={styles.collectionTitle}>{item.title}</h3>
                <p className={styles.collectionDescription}>{item.description}</p>
                <span className={styles.collectionPrice}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className={`${styles.aboutSection} ${styles.fadeSlide} ${styles.delay4}`}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImageContainer}>
              <img
                src="https://storage.googleapis.com/a1aa/image/105137f2-6723-433a-1634-828f7e73bcf0.jpg"
                alt="Artisan crafting luxury shoes in a workshop with wooden tools and leather materials, highlighting traditional craftsmanship"
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>TULY Shoe</h2>
              <p className={styles.aboutDescription}>
                Tại TULY Shoe, chúng tôi tin rằng mỗi bước chân của bạn đều phải là một tuyên ngôn về phong cách và sự tự tin. Giày của chúng tôi được chế tác bằng những vật liệu tốt nhất và tỉ mỉ đến từng chi tiết, kết hợp xu hướng hiện đại với sự thanh lịch vượt thời gian.
              </p>
              <p className={styles.aboutDescription}>
                Từ giày da cổ điển đến giày thể thao giản dị năng động, bộ sưu tập của chúng tôi được thiết kế để đáp ứng nhu cầu của mọi khách hàng. Trải nghiệm sự thoải mái và sang trọng vô song với TULY Shoe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`${styles.testimonialsSection} ${styles.fadeSlide} ${styles.delay4}`}>
        <h2 className={styles.sectionTitle}>Khác Hàng Của Chúng Tôi Nói Gì</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((item, index) => (
            <div key={index} className={styles.testimonialItem}>
              <img
                src={item.image}
                alt={item.alt}
                className={styles.testimonialImage}
              />
              <p className={styles.testimonialComment}>"{item.comment}"</p>
              <h3 className={styles.testimonialName}>{item.name}</h3>
              <span className={styles.testimonialRole}>{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`${styles.contactSection} ${styles.fadeSlide} ${styles.delay4}`}>
        <div className={styles.contactContainer}>
          <h2 style={{ color: 'white' }} className={styles.sectionTitle}>Bạn Cần TULY Shoe Hỗ Trợ</h2>
          <Form className={styles.contactForm} layout="vertical">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input placeholder="Your full name" className={styles.formInput} />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
              <Input placeholder="you@example.com" className={styles.formInput} />
            </Form.Item>
            <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please input your message!' }]}>
              <Input.TextArea placeholder="Write your message here..." rows={5} className={styles.formTextArea} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submitButton}>
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;