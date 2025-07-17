import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Typography,
  Image,
  Radio,
  Spin,
  Upload,
  DatePicker,
  message,
  Select,
} from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import dayjs from "dayjs";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { fetchData, updateData, uploadAvatar } from "../API/ApiService";
import { AuthContext } from "../API/AuthContext";

const { Title } = Typography;
const { Option } = Select;

const ProfileSection = ({
  setAvatar,
  setIsPasswordModalVisible,
  isPasswordModalVisible,
}) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addressForm] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districtsCache, setDistrictsCache] = useState({});
  const [wardsCache, setWardsCache] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [cropperVisible, setCropperVisible] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const cropperRef = useRef(null);
  const [lastValidAvatar, setLastValidAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, fetchUser } = useContext(AuthContext);

  const fetchUserInfo = async () => {
    try {
      const data = await fetchData("/account/info", true);
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
        address: data.address,
        email: data.email,
        dob: data.dob ? dayjs(data.dob) : null,
        gender: data.gender,
      };
      form.setFieldsValue(values);
      setInitialValues(values);
      setAvatar(data.avatar_image);
      setLastValidAvatar(data.avatar_image);
    } catch (err) {
      message.error("Không thể tải thông tin người dùng." + err.message);
    }
  };

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (err) {
      message.error("Không thể tải danh sách tỉnh/thành phố." + err.message);
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
      message.error("Không thể tải danh sách quận/huyện." + err.message);
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
      message.error("Không thể tải danh sách phường/xã." + err.message);
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
      setLoading(true);
      Promise.all([fetchUserInfo(), fetchProvinces()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAddressModalVisible && provinces.length > 0 && !initialLoadComplete) {
      const address = form.getFieldValue("address");
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
  ]);

  const handleUploadAvatar = async (info) => {
    const file = info.file;

    if (!file) {
      message.error("Không tìm thấy file");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
    setCropperImage(previewURL);
    setCropperVisible(true);
  };

  const handleCropAndUpload = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setAvatarLoading(true);
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob(async (blob) => {
        const croppedFile = new File([blob], "cropped-avatar.png", {
          type: "image/png",
        });

        const formData = new FormData();
        formData.append("avatar", croppedFile);

        try {
          const result = await uploadAvatar(formData);
          setAvatar(result.avatar);
          setLastValidAvatar(result.avatar);
          message.success("Cập nhật ảnh đại diện thành công!");
        } catch (err) {
          message.error("Upload ảnh thất bại: " + err.message);
        } finally {
          setAvatarLoading(false);
          setCropperVisible(false);
          setCropperImage("");
          setPreviewImage("");
        }
      }, "image/png");
    }
  };

  const handleProfileSubmit = async (values) => {
    setProfileLoading(true);
    try {
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
        first_name: firstName,
        last_name: lastName,
        phone: values.phone,
        dob: values.dob,
        gender: values.gender,
        address: values.address,
        email: values.email,
      };

      await updateData("/account/profile", "", payload, true);
      message.success("Cập nhật thông tin cá nhân thành công!");
      // Làm mới thông tin người dùng sau khi cập nhật
      await fetchUser();
      setIsEditing(false);
    } catch (err) {
      message.error("Cập nhật thông tin thất bại." + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setPasswordLoading(true);
    try {
      await updateData(
        "/account/change-password-user",
        "",
        {
          current_password: values.currentPassword,
          new_password: values.newPassword,
        },
        true
      );

      message.success("Mật khẩu đã được thay đổi thành công!");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (err) {
      message.error("Đổi mật khẩu thất bại: " + err.message);
    } finally {
      setPasswordLoading(false);
    }
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

  const handleEditToggle = () => {
    if (isEditing) {
      form.setFieldsValue(initialValues);
    } else {
      setInitialValues(form.getFieldsValue());
    }
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Title level={2} className={styles.title}>
            Thông tin cá nhân
          </Title>
          <div className={styles.profileContainer}>
            {/* Avatar */}
            <div className={styles.avatarContainer}>
              {avatarLoading ? (
                <div className={styles.avatarLoading}>
                  <Spin size="large" />
                </div>
              ) : (
                <Image
                  src={previewImage || lastValidAvatar}
                  alt="Ảnh đại diện"
                  className={styles.avatar}
                  width={176}
                  height={176}
                />
              )}
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => {
                  handleUploadAvatar(info);
                }}
                className={styles.avatarUpload}
              >
                <Button
                  icon={<CameraOutlined />}
                  className={styles.avatarUploadBtn}
                ></Button>
              </Upload>
            </div>

            {/* Form thông tin cá nhân */}
            <Form
              form={form}
              onFinish={handleProfileSubmit}
              className={styles.profileForm}
              layout="vertical"
            >
              <div className={styles.formGrid}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input disabled={!isEditing} placeholder="Nhập họ và tên" />
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
                  <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input
                    disabled={!isEditing}
                    onClick={() => !isEditing || setIsAddressModalVisible(true)}
                  />
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
                  <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  name="dob"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                    () => ({
                      validator(_, value) {
                        if (!value) return Promise.resolve();
                        if (value.isAfter(dayjs(), "day")) {
                          return Promise.reject(
                            "Ngày sinh không được sau ngày hiện tại"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    style={{ width: "100%" }}
                    disabled={!isEditing}
                  />
                </Form.Item>

                <Form.Item name="gender" label="Giới tính">
                  <Radio.Group disabled={!isEditing} className="readOnlyRadio">
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                    <Radio value="Khác">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className={styles.formButtons}>
                {isEditing ? (
                  <>
                    <Button onClick={handleEditToggle}>Hủy</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={profileLoading}
                      disabled={profileLoading}
                    >
                      Lưu thông tin
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={handleEditToggle}>
                    Chỉnh sửa thông tin cá nhân
                  </Button>
                )}
                <Button onClick={() => setIsPasswordModalVisible(true)}>
                  Thay đổi mật khẩu
                </Button>
              </div>
            </Form>
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
              <Title level={3}>Chọn địa chỉ</Title>
              <Form form={addressForm} onFinish={handleAddressSubmit}>
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
                    disabled={!isEditing}
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
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                    disabled={
                      !isEditing || !selectedProvince || isLoadingDistricts
                    }
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
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã" },
                  ]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    disabled={!isEditing || !selectedDistrict || isLoadingWards}
                    notFoundContent={
                      isLoadingWards ? <Spin size="small" /> : null
                    }
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
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ chi tiết",
                    },
                  ]}
                >
                  <Input
                    placeholder="Số nhà, tên đường..."
                    disabled={!isEditing}
                  />
                </Form.Item>
                <div className={styles.modalButtons}>
                  <Button
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
                    disabled={!isEditing}
                  >
                    Xác nhận
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          <Modal
            open={isPasswordModalVisible}
            onCancel={() => {
              setIsPasswordModalVisible(false);
              passwordForm.resetFields();
            }}
            footer={null}
            centered
            forceRender
            className={styles.modal}
            closeIcon={<CloseOutlined />}
          >
            <div className={styles.modalContent}>
              <Title level={3}>Thay đổi mật khẩu</Title>
              <Form form={passwordForm} onFinish={handlePasswordSubmit}>
                <Form.Item
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                    {
                      pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 chữ số",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu mới",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <div className={styles.modalButtons}>
                  <Button
                    onClick={() => {
                      setIsPasswordModalVisible(false);
                      passwordForm.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={passwordLoading}
                    disabled={passwordLoading}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          <Modal
            open={cropperVisible}
            onCancel={() => {
              setCropperVisible(false);
              setCropperImage("");
              setPreviewImage("");
            }}
            footer={
              <div className={styles.modalButtons}>
                <Button
                  onClick={() => {
                    setCropperVisible(false);
                    setCropperImage("");
                    setPreviewImage("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={handleCropAndUpload}
                  loading={avatarLoading}
                  disabled={avatarLoading}
                >
                  Lưu và Tải lên
                </Button>
              </div>
            }
            centered
            forceRender
            className={styles.modal}
            closeIcon={<CloseOutlined />}
          >
            <div className={styles.modalContent}>
              <Title level={3}>Cắt xén ảnh đại diện</Title>
              <div className={styles.cropperContainer}>
                <Cropper
                  ref={cropperRef}
                  src={cropperImage}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={1}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  scalable={true}
                  cropBoxResizable={true}
                  toggleDragModeOnDblclick={false}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProfileSection;
