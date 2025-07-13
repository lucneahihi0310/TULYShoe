import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Checkbox,
  Radio,
  Button,
  Tooltip,
  Modal,
  message,
  InputNumber,
  Form,
  Select,
  Spin,
} from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../CSS/Order.module.css";
import { AuthContext } from "../API/AuthContext";
import { fetchData, postData } from "../API/ApiService";
const { Option } = Select;

const Order = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [shippingFee, setShippingFee] = useState(0);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNote, setOrderNote] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districtsCache, setDistrictsCache] = useState({});
  const [wardsCache, setWardsCache] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (err) {
      message.error("Không thể tải danh sách tỉnh/thành phố: " + err.message);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceCode) => {
    if (districtsCache[provinceCode]) {
      return;
    }
    setIsLoadingDistricts(true);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistrictsCache((prev) => ({
        ...prev,
        [provinceCode]: data.districts,
      }));
    } catch (err) {
      message.error("Không thể tải danh sách quận/huyện: " + err.message);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtCode) => {
    if (wardsCache[districtCode]) {
      return;
    }
    setIsLoadingWards(true);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWardsCache((prev) => ({ ...prev, [districtCode]: data.wards }));
    } catch (err) {
      message.error("Không thể tải danh sách phường/xã: " + err.message);
    } finally {
      setIsLoadingWards(false);
    }
  };

  const parseAddress = (address) => {
    if (!address)
      return { detailedAddress: "", ward: "", district: "", province: "" };

    const parts = address.split(",").map((part) => part.trim().toLowerCase());
    let detailedAddress = parts[0];
    let ward = "";
    let district = "";
    let province = "";

    for (let i = parts.length - 1; i >= 0; i--) {
      if (!ward && (parts[i].includes("phường") || parts[i].includes("xã"))) {
        ward = parts[i].replace(/phường|xã/gi, "").trim();
      } else if (
        !district &&
        (parts[i].includes("quận") || parts[i].includes("huyện"))
      ) {
        district = parts[i].replace(/quận|huyện/gi, "").trim();
      } else if (
        !province &&
        (parts[i].includes("tỉnh") || parts[i].includes("thành phố"))
      ) {
        province = parts[i].replace(/tỉnh|thành phố/gi, "").trim();
      }
    }

    if (!ward || !district || !province) {
      detailedAddress = address;
      ward = "";
      district = "";
      province = "";
    }
    return { detailedAddress, ward, district, province };
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchUserInfo(), fetchProvinces()]);
    }
  }, [user]);

  useEffect(() => {
    if (isAddressModalVisible && provinces.length > 0 && !initialLoadComplete) {
      const address = userInfo.address;
      if (address) {
        const { province, district, ward, detailedAddress } =
          parseAddress(address);
        const provinceData = provinces.find((p) =>
          p.name.toLowerCase().includes(province)
        );
        if (provinceData) {
          setSelectedProvince(provinceData.code);
          fetchDistricts(provinceData.code).then(() => {
            if (districtsCache[provinceData.code]) {
              const districtData = districtsCache[provinceData.code].find((d) =>
                d.name.toLowerCase().includes(district)
              );
              if (districtData) {
                setSelectedDistrict(districtData.code);
                fetchWards(districtData.code).then(() => {
                  if (wardsCache[districtData.code]) {
                    const wardData = wardsCache[districtData.code].find((w) =>
                      w.name.toLowerCase().includes(ward)
                    );
                    addressForm.setFieldsValue({
                      province: provinceData.code,
                      district: districtData.code,
                      ward: wardData ? wardData.code : null,
                      detailedAddress,
                    });
                    setInitialLoadComplete(true);
                  }
                });
              } else {
                addressForm.setFieldsValue({
                  province: provinceData.code,
                  detailedAddress,
                });
                setInitialLoadComplete(true);
              }
            }
          });
        } else {
          addressForm.setFieldsValue({ detailedAddress });
          setInitialLoadComplete(true);
        }
      } else {
        setInitialLoadComplete(true);
      }
    }
  }, [
    isAddressModalVisible,
    provinces,
    districtsCache,
    wardsCache,
    isLoadingDistricts,
    isLoadingWards,
    userInfo.address,
  ]);

  useEffect(() => {
    const normalized = userInfo.address?.toLowerCase() || "";
    if (normalized.includes("hà nội")) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [userInfo.address]);

  const fetchUserInfo = async () => {
    if (!user) return;
    try {
      const data = await fetchData("account/info", true);
      let fullName = "";
      const firstNameParts = data.first_name
        ? data.first_name.trim().split(/\s+/)
        : [];
      const lastNameParts = data.last_name
        ? data.last_name.trim().split(/\s+/)
        : [];
      const totalWords = firstNameParts.length + lastNameParts.length;

      if (totalWords === 1) {
        fullName = data.last_name || "";
      } else if (totalWords === 2) {
        fullName = (firstNameParts[0] || "") + " " + (lastNameParts[0] || "");
      } else if (totalWords >= 3) {
        fullName =
          (firstNameParts.slice(0, 2).join(" ") || "") +
          " " +
          (lastNameParts.join(" ") || "");
      } else {
        fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
      }

      const values = {
        fullName: fullName.trim(),
        phone: data.phone,
        email: data.email,
        address: data.address,
      };
      setUserInfo(values);
      form.setFieldsValue(values);
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      message.error("Không thể tải thông tin người dùng: " + error.message);
    }
  };

  useEffect(() => {
    const fetchDataOrderItems = async () => {
      if (location.state?.fromCart && location.state.orderItems) {
        const enrichedItems = await Promise.all(
          location.state.orderItems.map(async (item) => {
            try {
              const data = await fetchData(
                `productDetail/customers/${item.pdetail_id}`
              );
              return {
                pdetail_id: item.pdetail_id,
                quantity: item.quantity,
                image: data.images[0],
                size_name: data.size_id?.size_name,
                color_code: data.color_id?.color_code,
                productName: data.product_id?.productName,
                price_after_discount: data.price_after_discount,
              };
            } catch (err) {
              console.error("Lỗi lấy chi tiết sản phẩm:", err);
              return null;
            }
          })
        );
        setOrderItems(enrichedItems.filter(Boolean));
      } else if (location.state?.fromDetail && location.state.orderItems) {
        const item = location.state.orderItems[0];
        try {
          const data = await fetchData(
            `productDetail/customers/${item.pdetail_id}`
          );
          setOrderItems([
            {
              pdetail_id: item.pdetail_id,
              quantity: item.quantity,
              image: data.images[0],
              size_name: data.size_id?.size_name,
              color_code: data.color_id?.color_code,
              productName: data.product_id?.productName,
              price_after_discount: data.price_after_discount,
            },
          ]);
        } catch (err) {
          console.error("Lỗi lấy chi tiết sản phẩm:", err);
        }
      }
    };

    fetchDataOrderItems();
  }, [location]);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price_after_discount,
    0
  );

  const estimatedDeliveryDate = () => {
    const date = new Date();
    const isHanoi = userInfo.address?.toLowerCase().includes("hà nội");
    date.setDate(date.getDate() + (isHanoi ? 3 : 5));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddressSubmit = async (values) => {
    const province = provinces.find((p) => p.code === values.province)?.name;
    const district = districtsCache[selectedProvince]?.find(
      (d) => d.code === values.district
    )?.name;
    const ward = wardsCache[selectedDistrict]?.find(
      (w) => w.code === values.ward
    )?.name;
    let detailedAddress = values.detailedAddress;

    const parts = detailedAddress
      .split(",")
      .map((part) => part.trim().toLowerCase());
    detailedAddress = parts[0];

    const fullAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`
      .replace(/,\s*,/, ",")
      .replace(/^,|,$/g, "");
    setUserInfo((prev) => ({ ...prev, address: fullAddress }));
    form.setFieldsValue({ address: fullAddress });
    setIsAddressModalVisible(false);
    addressForm.resetFields();
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setDistrictsCache({});
    setWardsCache({});
    setInitialLoadComplete(false);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict(null);
    setWardsCache({});
    addressForm.setFieldsValue({ district: null, ward: null });
    fetchDistricts(value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWardsCache({});
    addressForm.setFieldsValue({ ward: null });
    fetchWards(value);
  };

  const handleOrderSubmit = async () => {
    if (orderItems.length === 0) {
      return message.warning("Không có sản phẩm để đặt hàng.");
    }

    const values = form.getFieldsValue();
    const nameParts = values.fullName.trim().split(/\s+/);
    let firstName = "";
    let lastName = "";

    if (nameParts.length === 1) {
      lastName = nameParts[0] || "";
    } else if (nameParts.length === 2) {
      firstName = nameParts[0] || "";
      lastName = nameParts[1] || "";
    } else if (nameParts.length >= 3) {
      firstName = nameParts.slice(0, 2).join(" ") || "";
      lastName = nameParts.slice(2).join(" ") || "";
    }

    const payload = {
      user_id: user?._id || null,
      orderItems: orderItems.map((item) => ({
        pdetail_id: item.pdetail_id,
        quantity: item.quantity,
        price_after_discount: item.price_after_discount,
        productName: item.productName,
        size_name: item.size_name,
      })),
      userInfo: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        first_name: firstName,
        last_name: lastName,
      },
      paymentMethod,
      orderNote,
      shippingFee,
      isFromCart: location.state?.fromCart === true,
    };

    if (paymentMethod === "cod") {
      Modal.confirm({
        title: "Xác nhận đặt hàng",
        content: "Bạn có chắc chắn muốn đặt hàng với phương thức COD?",
        okText: "Xác nhận",
        icon: <QuestionCircleOutlined />,
        cancelButtonProps: { style: { display: "none" } },
        closable: true,
        async onOk() {
          try {
            const data = await postData("/orders/customers", payload, true);

            if (data?.order_code) {
              message.success("Đặt hàng thành công!");
              if (!user && location.state?.fromCart) {
                localStorage.removeItem("guest_cart");
                sessionStorage.removeItem("guest_cart");
              }
              window.dispatchEvent(new Event("cartUpdated"));
              navigate("/order-success", {
                state: { order_code: data.order_code },
              });
            } else {
              message.error(data?.message || "Đặt hàng thất bại");
            }
          } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            message.error("Lỗi kết nối đến server.");
          }
        },
      });
    } else {
      Modal.confirm({
        title: "Xác nhận đặt hàng",
        content: "Bạn có chắc chắn muốn thanh toán với VNPay?",
        okText: "Xác nhận",
        icon: <QuestionCircleOutlined />,
        cancelButtonProps: { style: { display: "none" } },
        closable: true,
        async onOk() {
          try {
            const data = await postData(
              "vnpay/create",
              {
                ...payload,
                amount: totalAmount,
                paymentMethod: "online",
              },
              true
            );

            if (data?.paymentUrl) {
              window.dispatchEvent(new Event("cartUpdated"));
              if (!user && location.state?.fromCart) {
                localStorage.removeItem("guest_cart");
                sessionStorage.removeItem("guest_cart");
              }
              sessionStorage.setItem("order_code", data.order_code);
              window.location.href = data.paymentUrl;
            } else {
              message.error(
                data?.message || "Không thể tạo liên kết thanh toán."
              );
            }
          } catch (err) {
            console.error("Lỗi khi gọi VNPay:", err);
            message.error("Lỗi kết nối đến VNPay.");
          }
        },
      });
    }
  };

  return (
    <main className={`${styles.main} ${styles.fadeIn}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Đặt hàng tại TULY Shoe</h2>
        <div className={styles.content}>
          <section className={styles.formSection}>
            <Form form={form} className={styles.form} layout="vertical">
              <h3 className={styles.sectionTitle}>Thông tin giao hàng</h3>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Họ tên" className={styles.input} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^0\d{9}$/,
                    message:
                      "Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" className={styles.input} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    type: "email",
                    message: "Email không hợp lệ. Ví dụ: abc@gmail.com",
                  },
                ]}
              >
                <Input placeholder="Email" className={styles.input} />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input
                  placeholder="Địa chỉ"
                  className={styles.input}
                  onClick={() => setIsAddressModalVisible(true)}
                />
              </Form.Item>

              <h3 className={styles.sectionTitle}>Ghi chú đơn hàng</h3>
              <Input.TextArea
                rows={3}
                className={styles.input}
                placeholder="Giao buổi sáng, gọi trước khi đến..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />

              <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={styles.radioGroup}
              >
                <Radio value="cod" className={styles.radio}>
                  Thanh toán khi giao hàng (COD)
                </Radio>
                <Radio value="online" className={styles.radio}>
                  Thanh toán trực tuyến
                </Radio>
              </Radio.Group>
            </Form>
          </section>

          <aside className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>
            <div className={styles.summaryItems}>
              {orderItems.map((item, idx) => (
                <div className={styles.product} key={idx}>
                  <div className={styles.productInfo}>
                    <img src={item.image} className={styles.productImage} />
                    <div>
                      <p className={styles.productName}>{item.productName}</p>
                      <p className={styles.productDetail}>
                        Size: {item.size_name}
                      </p>
                      <div className={styles.colorDotWrapper}>
                        <span>Màu:</span>
                        <span
                          className={styles.colorDot}
                          style={{
                            backgroundColor: item.color_code,
                          }}
                        />
                      </div>
                      <p className={styles.productPriceLine}>
                        Giá: {item.price_after_discount.toLocaleString()} ₫
                      </p>
                      <div className={styles.productQtyWrapper}>
                        <span>Số lượng:</span>
                        <InputNumber
                          min={1}
                          max={99}
                          value={item.quantity}
                          disabled={!!location.state?.fromCart}
                          onChange={(val) => {
                            if (!location.state?.cartItems) {
                              setOrderItems((prev) =>
                                prev.map((itm, i) =>
                                  i === idx ? { ...itm, quantity: val } : itm
                                )
                              );
                            }
                          }}
                          className={styles.qtyInput}
                          size="small"
                          style={{ marginLeft: 8 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.productPrice}>
                    {(
                      item.price_after_discount * item.quantity
                    ).toLocaleString()}{" "}
                    ₫
                  </div>
                </div>
              ))}
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Đơn hàng</span>
                <span>{totalAmount.toLocaleString()} ₫</span>
              </div>
              <div className={styles.summaryRowSecondary}>
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()} ₫</span>
              </div>

              <div className={styles.summaryRowSecondary}>
                <span>Ngày giao dự kiến</span>
                <span>
                  {estimatedDeliveryDate()} (
                  {userInfo.address?.toLowerCase().includes("hà nội")
                    ? "3"
                    : "5"}{" "}
                  ngày)
                </span>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.total}>
              <span>TỔNG CỘNG</span>
              <span>{(totalAmount + shippingFee).toLocaleString()} ₫</span>
            </div>

            <Button className={styles.submitButton} onClick={handleOrderSubmit}>
              HOÀN TẤT ĐẶT HÀNG
            </Button>
          </aside>
        </div>
      </div>

      <Modal
        open={isAddressModalVisible}
        onCancel={() => {
          setIsAddressModalVisible(false);
          addressForm.resetFields();
          setSelectedProvince(null);
          setSelectedDistrict(null);
          setDistrictsCache({});
          setWardsCache({});
          setInitialLoadComplete(false);
        }}
        footer={null}
        centered
        forceRender
        className={styles.modal}
        closeIcon={<CloseOutlined />}
      >
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>Chọn địa chỉ</h3>
          <Form
            form={addressForm}
            onFinish={handleAddressSubmit}
            layout="vertical"
            className={styles.modalForm}
          >
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
              ]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
                value={selectedProvince}
                className={styles.modalSelect}
                notFoundContent={
                  isLoadingProvinces ? <Spin size="small" /> : null
                }
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                value={selectedDistrict}
                disabled={!selectedProvince || isLoadingDistricts}
                className={styles.modalSelect}
                notFoundContent={
                  isLoadingDistricts ? <Spin size="small" /> : null
                }
              >
                {districtsCache[selectedProvince]?.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={!selectedDistrict || isLoadingWards}
                className={styles.modalSelect}
                notFoundContent={isLoadingWards ? <Spin size="small" /> : null}
              >
                {wardsCache[selectedDistrict]?.map((ward) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="detailedAddress"
              label="Địa chỉ chi tiết"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
              ]}
            >
              <Input
                placeholder="Số nhà, tên đường..."
                className={styles.modalInput}
              />
            </Form.Item>
            <div className={styles.modalButtons}>
              <Button
                className={styles.modalCancelButton}
                onClick={() => {
                  setIsAddressModalVisible(false);
                  addressForm.resetFields();
                  setSelectedProvince(null);
                  setSelectedDistrict(null);
                  setDistrictsCache({});
                  setWardsCache({});
                  setInitialLoadComplete(false);
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.modalSubmitButton}
              >
                Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </main>
  );
};

export default Order;
