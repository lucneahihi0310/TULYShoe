import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Input,
  Row,
  Button,
  Space,
  Modal,
  Form,
  Table,
  Select,
  Popconfirm,
  message,
  InputNumber,
  Upload,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerProduct = () => {
  const [categories, setCategories] = useState([]);
  const [categories_2, setCategories_2] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [forms, setForms] = useState([]);
  const [genders, setGenders] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [product_detail_statuses, setProduct_detail_statuses] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [product_detail_by_ids, setProduct_detail_by_ids] = useState([]);
  const [edittingRow, setEdittingRow] = useState(null);
  const [filterCategoryName, setFilterCategoryName] = useState("");
  const [addCategory, setAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form_edit] = Form.useForm();
  const [form_add_product_detail] = Form.useForm();
  const [form_edit_product_detail] = Form.useForm();
  const [listProductDetail, setListProductDetail] = useState(false);
  const [addProductDetail, setAddProductDetail] = useState(false);
  const [editProductDetail, setEditProductDetail] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [editProductDetailId, setEditProductDetailId] = useState(null);
  const [currentProductPrice, setCurrentProductPrice] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const [croppedImages, setCroppedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const cropperRef = useRef(null);
  const [fileQueue, setFileQueue] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const loadingIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

  // Hàm upload lên Cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "product-detail-images");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drpiifgqs/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    if (json.secure_url) {
      return json.secure_url;
    }
    throw new Error("Upload failed");
  };

  // Handler customRequest cho AntD Upload
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    setFileQueue((prev) => [
      ...prev,
      { uid: file.uid, name: file.name, status: "pending", file },
    ]);
  };

  // Crop và upload ảnh
  const handleCropAndUpload = async () => {
    if (cropperRef.current?.cropper) {
      const cropper = cropperRef.current.cropper;
      const cropBoxData = cropper.getCropBoxData();

      const croppedCanvas = cropper.getCroppedCanvas({
        width: cropBoxData.width,
        height: cropBoxData.height,
      });

      croppedCanvas.toBlob(async (blob) => {
        const croppedFile = new File([blob], `cropped-${Date.now()}.png`, {
          type: "image/png",
        });

        try {
          const url = await uploadToCloudinary(croppedFile);

          setCroppedImages((prev) => [...prev, url]);
          setFileList((prev) =>
            prev.map((f) =>
              f.uid ===
                fileList.find((file) => file.status === "uploading")?.uid
                ? { ...f, status: "done", url }
                : f
            )
          );
          setCropperVisible(false);
          setCropperImage("");
          message.success("Cắt và tải ảnh thành công!");
        } catch (err) {
          console.error(err);
          message.error("Upload failed");
          setFileList((prev) =>
            prev.map((f) =>
              f.uid ===
                fileList.find((file) => file.status === "uploading")?.uid
                ? { ...f, status: "error" }
                : f
            )
          );
          setCropperVisible(false);
          setCropperImage("");
        }
      }, "image/png");
    }
  };

  useEffect(() => {
    if (!cropperVisible && fileQueue.length > 0) {
      const nextFile = fileQueue[0];
      setCropperImage(URL.createObjectURL(nextFile.file));
      setCropperVisible(true);

      // Cập nhật fileList: đặt trạng thái 'uploading'
      setFileList((prevList) => {
        const filteredPrev = prevList.filter((f) => f.uid !== nextFile.uid);
        return [
          ...filteredPrev,
          {
            uid: nextFile.uid,
            name: nextFile.name,
            status: "uploading",
            file: nextFile.file,
          },
        ];
      });

      // Loại file ra khỏi queue
      setFileQueue((prev) => prev.slice(1));
    }
  }, [fileQueue, cropperVisible]);

  // Handle canceling the crop modal
  const handleCropCancel = () => {
    setCropperVisible(false);
    setCropperImage("");
    setFileList((prev) =>
      prev.filter((f) => f.status !== "uploading" || f.status === "done")
    );
  };

  // Khi bấm xóa ảnh preview
  const handleRemove = (file) => {
    setCroppedImages((prev) => prev.filter((u) => u !== file.url));
    setFileList((prev) => prev.filter((f) => f.url !== file.url));
    setFileQueue((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const showAddCategoryModal = () => {
    setAddCategory(true);
  };

  const handleCancelAddCategory = () => {
    setAddCategory(false);
    form2.resetFields();
  };

  const showEditCategoryModal = (record) => {
    setEdittingRow(record._id);
    form_edit.setFieldsValue({
      productName: record.productName,
      title: record.title,
      description: record.description,
      price: record.price,
      categories_id: record.categories_id._id,
      brand_id: record.brand_id._id,
      material_id: record.material_id._id,
      form_id: record.form_id._id,
      gender_id: record.gender_id._id,
    });
    setEditCategory(true);
  };

  const handleCancelEditCategory = () => {
    setEditCategory(false);
    setEdittingRow(null);
    form_edit.resetFields();
  };

  const handleEditCategory = async () => {
    try {
      const record = await form_edit.validateFields();
      await updateData(
        "products/manager/edit_product",
        edittingRow,
        {
          productName: record.productName,
          title: record.title,
          description: record.description,
          price: record.price,
          categories_id: record.categories_id,
          brand_id: record.brand_id,
          material_id: record.material_id,
          form_id: record.form_id,
          gender_id: record.gender_id,
        },
        true
      );
      message.success("Cập nhật thành công!");
      setEdittingRow(null);
      setEditCategory(false);
      form_edit.resetFields();
      fetchCategories();
    } catch (error) {
      console.log(error);
      message.error("Cập nhật thất bại!");
    }
  };

  const handleDeleteCategory = async (id) => {
    await deleteData("/products/manager/delete_product", id, true);
    fetchCategories();
  };

  const showProductDetail = async (productId, record) => {
    setLoading(true);
    try {
      const res = await fetchData(
        `/product_details/manager/list_product_detail_by_id/${productId}`
      );
      setDetailData(res);
      setCurrentProductPrice(record.price);
      setCurrentProductId(productId);
      setListProductDetail(true);
    } catch (error) {
      console.error("Lỗi khi fetch product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShowProductDetail = () => {
    setListProductDetail(false);
  };

  const showEditProductDetailModal = async (record) => {
    setEditProductDetailId(record);
    form_edit_product_detail.setFieldsValue({
      product_id: record.product_id._id,
      color: record.color_id._id,
      size: record.size_id._id,
      discount: record.discount_id._id,
      inventory_number: record.inventory_number,
      sold_number: record.sold_number,
      price_after_discount: record.price_after_discount,
      product_detail_status: record.product_detail_status._id,
      images: record.images,
    });
    setCroppedImages(record.images);
    setFileList(
      record.images.map((url) => ({ uid: url, url, status: "done" }))
    );
    setEditProductDetail(true);
  };

  const handleCancelEditProductDetail = () => {
    setEditProductDetail(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchCategories_2();
    fetchBrands();
    fetchMaterials();
    fetchForms();
    fetchGenders();
    fetchColors();
    fetchSizes();
    fetchDiscounts();
    fetchProductDetailStatuses();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/products/manager/list_product");
      setCategories(res);
    } catch (error) {
      console.error("Lỗi khi fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories_2 = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/categories/manager/list_category");
      setCategories_2(res);
    } catch (error) {
      console.error("Lỗi khi fetch categories_2:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/brands/manager/list_brand");
      setBrands(res);
    } catch (error) {
      console.error("Lỗi khi fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/materials/manager/list_material");
      setMaterials(res);
    } catch (error) {
      console.error("Lỗi khi fetch materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/forms/manager/list_form");
      setForms(res);
    } catch (error) {
      console.error("Lỗi khi fetch forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenders = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/genders/manager/list_gender");
      setGenders(res);
    } catch (error) {
      console.error("Lỗi khi fetch genders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/colors/manager/list_color");
      setColors(res);
    } catch (error) {
      console.error("Lỗi khi fetch colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/sizes/manager/list_size");
      setSizes(res);
    } catch (error) {
      console.error("Lỗi khi fetch sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/discounts/manager/list_discount");
      setDiscounts(res);
    } catch (error) {
      console.error("Lỗi khi fetch discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetailStatuses = async () => {
    setLoading(true);
    try {
      const res = await fetchData(
        "/product_detail_status/manager/list_product_detail_status"
      );
      setProduct_detail_statuses(res);
    } catch (error) {
      console.error("Lỗi khi fetch product detail statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchCategory = categories.filter((c) => {
    const findCategoryByName = c.productName
      .toLowerCase()
      .includes(filterCategoryName.toLowerCase());
    return findCategoryByName;
  });

  const columns = [
    {
      title: "No",
      key: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 210,
    },
    {
      title: "Mô Tả Ngắn",
      dataIndex: "title",
      key: "title",
      width: 210,
    },
    {
      title: "Mô Tả Chi Tiết",
      dataIndex: "description",
      key: "description",
      width: 210,
      render: (value) => {
        const toggleExpanded = () => {
          setExpanded((prev) => !prev);
        };

        const shortText = value?.slice(0, 120);

        return (
          <div>
            {expanded ? value : shortText + (value.length > 120 ? "..." : "")}
            {value.length > 120 && (
              <div>
                <Button
                  type="link"
                  onClick={toggleExpanded}
                  style={{ padding: 0 }}
                >
                  {expanded ? "Ẩn bớt" : "Xem thêm"}
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Thông Tin Sản Phẩm",
      key: "info",
      render: (_, record) => (
        <div>
          <div>Price: {record.price}</div>
          <div>Category name: {record.categories_id.category_name}</div>
          <div>Brand name: {record.brand_id.brand_name}</div>
          <div>Material name: {record.material_id.material_name}</div>
          <div>Form name: {record.form_id.form_name}</div>
          <div>
            Gender name: {record.gender_id?.gender_name || "Không có gender"}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày",
      key: "date",
      width: 200,
      render: (_, record) => (
        <div>
          <div>Ngày tạo: {record.create_at}</div>
          {record.update_at && record.update_at !== record.create_at && (
            <div>Ngày cập nhật: {record.update_at}</div>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <div>
            <Row>
              <Button
                style={{ margin: "5px" }}
                color="primary"
                variant="solid"
                icon={<UnorderedListOutlined />}
                onClick={() => showProductDetail(record._id, record)}
              >
                Chi Tiết
              </Button>
            </Row>
            <Row>
              <Button
                style={{ margin: "5px" }}
                color="yellow"
                variant="solid"
                icon={<EditOutlined />}
                onClick={() => showEditCategoryModal(record)}
              >
                Sửa
              </Button>
            </Row>
            <Row>
              <Popconfirm
                title="Are you sure to delete this category?"
                onConfirm={() => handleDeleteCategory(record._id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ size: "small", style: { width: "110px" } }}
                cancelButtonProps={{
                  size: "small",
                  style: { width: "110px" },
                }}
              >
                <Button
                  style={{ margin: "5px" }}
                  color="danger"
                  variant="solid"
                  icon={<DeleteOutlined />}
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Row>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        borderRadius: "0px",
        padding: "10px",
        backgroundColor: "#f7f9fa",
        width: "100%",
      }}
    >
      <Row gutter={16} style={{ padding: "10px" }}>
        <Col span={5}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h4>Quản Lý Sản Phẩm</h4>
          </div>
        </Col>
        <Col span={8} offset={3}>
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            prefix={<SearchOutlined />}
            onChange={(e) => setFilterCategoryName(e.target.value)}
            size="large"
          />
        </Col>
        <Col span={4} offset={4}>
          <Button
            shape="round"
            icon={<PlusOutlined />}
            onClick={showAddCategoryModal}
            size="large"
          >
            Tạo Thêm Sản Phẩm
          </Button>
          <Modal
            title="Add new product"
            closable={{ "aria-label": "Custom Close Button" }}
            open={addCategory}
            onCancel={handleCancelAddCategory}
            footer={null}
          >
            <Form
              form={form2}
              name="wrap"
              labelCol={{ flex: "110px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
              onFinish={async (values) => {
                try {
                  await postData(
                    "/products/manager/create_product",
                    {
                      productName: values.productName,
                      title: values.title,
                      description: values.description,
                      price: values.price,
                      categories_id: values.categories_id,
                      brand_id: values.brand_id,
                      material_id: values.material_id,
                      form_id: values.form_id,
                      gender_id: values.gender_id,
                    },
                    true
                  );
                  message.success("Thêm thành công!");
                  form2.resetFields();
                  setAddCategory(false);
                  fetchCategories();
                } catch (error) {
                  console.log(error);
                  message.error("Thêm thất bại!");
                }
              }}
            >
              <Form.Item
                label="Product name"
                name="productName"
                rules={[
                  { required: true, message: "Please enter product name" },
                  {
                    validator: (_, value) => {
                      const isDuplicate = categories.some(
                        (cat) =>
                          cat.productName.trim().toLowerCase() ===
                          value?.trim().toLowerCase()
                      );
                      return isDuplicate
                        ? Promise.reject("This product name already exists!")
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter title" }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please enter description" }]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please enter price" },
                  {
                    validator: (_, value) => {
                      const num = parseFloat(value);
                      if (isNaN(num)) {
                        return Promise.reject("Giá phải là một số");
                      }
                      if (num <= 0) {
                        return Promise.reject("Giá phải lớn hơn 0");
                      }
                      if (!Number.isInteger(num)) {
                        return Promise.reject("Giá phải là số nguyên");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Enter product price" />
              </Form.Item>
              <Form.Item
                label="Category"
                name="categories_id"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select category"
                  allowClear
                  options={categories_2.map((p) => ({
                    label: p.category_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Brand"
                name="brand_id"
                rules={[{ required: true, message: "Please select brand" }]}
              >
                <Select
                  placeholder="Select brand"
                  allowClear
                  options={brands.map((p) => ({
                    label: p.brand_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Material"
                name="material_id"
                rules={[{ required: true, message: "Please select material" }]}
              >
                <Select
                  placeholder="Select material"
                  allowClear
                  options={materials.map((p) => ({
                    label: p.material_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Form"
                name="form_id"
                rules={[{ required: true, message: "Please select form" }]}
              >
                <Select
                  placeholder="Select form"
                  allowClear
                  options={forms.map((p) => ({
                    label: p.form_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender_id"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  placeholder="Select gender"
                  allowClear
                  options={genders.map((p) => ({
                    label: p.gender_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Edit Product"
            closable={{ "aria-label": "Custom Close Button" }}
            open={editCategory}
            onCancel={handleCancelEditCategory}
            footer={null}
          >
            <Form
              form={form_edit}
              name="edit_product"
              labelCol={{ flex: "110px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
              onFinish={handleEditCategory}
            >
              <Form.Item
                label="Product name"
                name="productName"
                rules={[
                  { required: true, message: "Please enter product name" },
                  {
                    validator: (_, value) => {
                      const isDuplicate = categories.some(
                        (cat) =>
                          cat.productName.trim().toLowerCase() ===
                          value?.trim().toLowerCase() &&
                          cat._id !== edittingRow
                      );
                      return isDuplicate
                        ? Promise.reject("This product name already exists!")
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter title" }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please enter description" }]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input placeholder="Enter product price" />
              </Form.Item>
              <Form.Item
                label="Category"
                name="categories_id"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select category"
                  allowClear
                  options={categories_2.map((p) => ({
                    label: p.category_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Brand"
                name="brand_id"
                rules={[{ required: true, message: "Please select brand" }]}
              >
                <Select
                  placeholder="Select brand"
                  allowClear
                  options={brands.map((p) => ({
                    label: p.brand_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Material"
                name="material_id"
                rules={[{ required: true, message: "Please select material" }]}
              >
                <Select
                  placeholder="Select material"
                  allowClear
                  options={materials.map((p) => ({
                    label: p.material_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Form"
                name="form_id"
                rules={[{ required: true, message: "Please select form" }]}
              >
                <Select
                  placeholder="Select form"
                  allowClear
                  options={forms.map((p) => ({
                    label: p.form_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender_id"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  placeholder="Select gender"
                  allowClear
                  options={genders.map((p) => ({
                    label: p.gender_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button onClick={handleCancelEditCategory}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
      <div justify={"center"} align={"middle"}>
        <Modal
          title="Danh Sách Chi Tiết Sản Phẩm"
          closable={{ "aria-label": "Custom Close Button" }}
          open={listProductDetail}
          onCancel={handleCancelShowProductDetail}
          footer={null}
          width={800}
        >
          <Button
            style={{ width: "200px", marginBottom: "15px" }}
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => {
              form_add_product_detail.setFieldsValue({
                product_id: currentProductId,
                sold_number: 0,
              });
              setAddProductDetail(true);
            }}
          >
            Tạo thêm
          </Button>
          <Modal
            title="Add Product Detail"
            closable={{ "aria-label": "Custom Close Button" }}
            open={addProductDetail}
            onCancel={() => {
              setAddProductDetail(false);
              setCroppedImages([]);
              setFileList([]);
              setFileQueue([]);
            }}
            footer={null}
          >
            <Form
              form={form_add_product_detail}
              name="wrap"
              labelCol={{ flex: "110px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
              onFinish={async (values) => {
                if (!croppedImages.length) {
                  message.error("Vui lòng upload ít nhất một ảnh");
                  return;
                }
                try {
                  const payloads = values.size.map((size_id) => ({
                    product_id: values.product_id,
                    color_id: values.color,
                    size_id,
                    discount_id: values.discount,
                    inventory_number: values.inventory_number,
                    sold_number: values.sold_number,
                    price_after_discount: values.price_after_discount,
                    product_detail_status: values.product_detail_status,
                    images: croppedImages,
                  }));
                  await Promise.all(
                    payloads.map((payload) =>
                      postData(
                        "/product_details/manager/create_product_detail",
                        payload,
                        true
                      )
                    )
                  );
                  message.success("Thêm thành công!");
                  form_add_product_detail.resetFields();
                  setCroppedImages([]);
                  setFileList([]);
                  setFileQueue([]);
                  setAddProductDetail(false);
                  showProductDetail(currentProductId, {
                    price: currentProductPrice,
                  });
                } catch (error) {
                  console.log(error);
                  message.error("Thêm thất bại!");
                }
              }}
            >
              <Form.Item
                label="Id sản phẩm"
                name="product_id"
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input disabled placeholder="Enter product name" />
              </Form.Item>
              <Form.Item
                label="Color"
                name="color"
                rules={[{ required: true, message: "Please select color" }]}
              >
                <Select
                  placeholder="Select color"
                  allowClear
                  options={colors.map((c) => ({
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: c.color_code,
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        />
                        <span>{c.color_code}</span>
                      </div>
                    ),
                    value: c._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Size"
                name="size"
                rules={[{ required: true, message: "Please select at least one size" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select size"
                  allowClear
                  options={sizes.map((s) => ({
                    label: s.size_name,
                    value: s._id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[{ required: true, message: "Please select discount" }]}
              >
                <Select
                  placeholder="Select discount"
                  allowClear
                  options={discounts.map((d) => ({
                    label: `${d.percent_discount}%`,
                    value: d._id,
                  }))}
                  onChange={(selectedDiscountId) => {
                    const selectedDiscount = discounts.find(
                      (d) => d._id === selectedDiscountId
                    );
                    if (selectedDiscount) {
                      const priceAfter =
                        currentProductPrice *
                        (1 - selectedDiscount.percent_discount / 100);
                      form_add_product_detail.setFieldsValue({
                        price_after_discount: Math.round(priceAfter),
                      });
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Inventory number"
                name="inventory_number"
                rules={[{ required: true, message: "Hãy điền inventory number" }]}
              >
                <InputNumber
                  placeholder="Enter inventory number"
                  style={{ width: "100%" }}
                  min={1}
                  precision={0}
                />
              </Form.Item>
              <Form.Item label="Sold number" name="sold_number">
                <InputNumber value={0} style={{ width: "100%" }} disabled />
              </Form.Item>
              <Form.Item
                label="Price after discount"
                name="price_after_discount"
                rules={[{ required: true, message: "Please enter price after discount" }]}
              >
                <InputNumber
                  placeholder="Auto calculated"
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Images"
                name="images"
                rules={[{ required: true, message: "Please upload at least one image" }]}
              >
                <Upload
                  multiple
                  listType="picture-card"
                  customRequest={handleCustomRequest}
                  fileList={fileList}
                  onRemove={handleRemove}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                label="Product detail status"
                name="product_detail_status"
                rules={[{ required: true, message: "Please select product detail status" }]}
              >
                <Select
                  placeholder="Select product detail status"
                  allowClear
                  options={product_detail_statuses.map((p) => ({
                    label: p.productdetail_status_name,
                    value: p._id,
                  }))}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Crop Image"
            open={cropperVisible}
            onCancel={handleCropCancel}
            footer={
              <div>
                <Button onClick={handleCropCancel}>Cancel</Button>
                <Button type="primary" onClick={handleCropAndUpload}>
                  Crop and Upload
                </Button>
              </div>
            }
          >
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
          </Modal>
          {detailData.length > 0 ? (
            <Table
              rowKey="_id"
              dataSource={detailData}
              pagination={false}
              loading={{ indicator: loadingIcon, spinning: loading }}
              columns={[
                {
                  title: "No",
                  key: "no",
                  render: (text, _, index) => index + 1,
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: ["product_id", "productName"],
                  key: "productName",
                },
                {
                  title: "Ảnh",
                  key: "image",
                  render: (_, record) => (
                    <div
                      style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                    >
                      {record.images?.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`img-${index}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Thông tin",
                  key: "info",
                  render: (_, record) => (
                    <div>
                      <div style={{ display: "flex" }}>
                        Color: {record.color_id.color_code}
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: record.color_id.color_code,
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            marginLeft: "5px",
                          }}
                        />
                      </div>
                      <div>Size: {record.size_id.size_name}</div>
                      <div>Discount: {record.discount_id.percent_discount}%</div>
                      <div>Inventory number: {record.inventory_number}</div>
                      <div>Sold number: {record.sold_number}</div>
                      <div>
                        Price after discount: {record.price_after_discount}
                      </div>
                      <div>
                        Product detail status:{" "}
                        {record.product_detail_status.productdetail_status_name}
                      </div>
                      <div>Created: {record.create_at}</div>
                      {record.update_at && record.update_at !== record.create_at && (
                        <div>Updated: {record.update_at}</div>
                      )}
                    </div>
                  ),
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => (
                    <div>
                      <Row>
                        <Button
                          style={{ margin: "5px" }}
                          color="yellow"
                          variant="solid"
                          icon={<EditOutlined />}
                          onClick={() => showEditProductDetailModal(record)}
                        >
                          Sửa
                        </Button>
                      </Row>
                      <Row>
                        <Popconfirm
                          title="Are you sure to delete this product detail?"
                          onConfirm={async () => {
                            await deleteData(
                              "/product_details/manager/delete_product_detail",
                              record._id,
                              true
                            );
                            message.success("Xóa thành công!");
                            showProductDetail(currentProductId, {
                              price: currentProductPrice,
                            });
                          }}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{
                            size: "small",
                            style: { width: "110px" },
                          }}
                          cancelButtonProps={{
                            size: "small",
                            style: { width: "110px" },
                          }}
                        >
                          <Button
                            style={{ margin: "5px" }}
                            color="danger"
                            variant="solid"
                            icon={<DeleteOutlined />}
                          >
                            Xóa
                          </Button>
                        </Popconfirm>
                      </Row>
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            <p>Không có chi tiết cho sản phẩm này.</p>
          )}
        </Modal>
        <Modal
          title="Edit Product Detail"
          closable={{ "aria-label": "Custom Close Button" }}
          open={editProductDetail}
          onCancel={() => {
            setEditProductDetail(false);
            setCroppedImages([]);
            setFileList([]);
            setFileQueue([]);
          }}
          footer={null}
        >
          <Form
            form={form_edit_product_detail}
            name="wrap"
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            onFinish={async (values) => {
              if (!croppedImages.length) {
                message.error("Vui lòng upload ít nhất một ảnh");
                return;
              }
              const payload = {
                product_id: values.product_id,
                color_id: values.color,
                size_id: values.size,
                discount_id: values.discount,
                inventory_number: values.inventory_number,
                sold_number: values.sold_number,
                price_after_discount: values.price_after_discount,
                product_detail_status: values.product_detail_status,
                images: croppedImages,
              };
              await updateData(
                "/product_details/manager/edit_product_detail",
                editProductDetailId._id,
                payload,
                true
              );
              message.success("Cập nhật thành công!");
              form_edit_product_detail.resetFields();
              setCroppedImages([]);
              setFileList([]);
              setFileQueue([]);
              setEditProductDetail(false);
              showProductDetail(currentProductId, {
                price: currentProductPrice,
              });
            }}
          >
            <Form.Item
              label="Id sản phẩm"
              name="product_id"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input disabled placeholder="Enter product name" />
            </Form.Item>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please select color" }]}
            >
              <Select
                placeholder="Select color"
                allowClear
                options={colors.map((c) => ({
                  label: (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: c.color_code,
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <span>{c.color_code}</span>
                    </div>
                  ),
                  value: c._id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Size"
              name="size"
              rules={[{ required: true, message: "Please select size" }]}
            >
              <Select
                placeholder="Select size"
                allowClear
                options={sizes.map((s) => ({
                  label: s.size_name,
                  value: s._id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: "Please select discount" }]}
            >
              <Select
                placeholder="Select discount"
                allowClear
                options={discounts.map((d) => ({
                  label: `${d.percent_discount}%`,
                  value: d._id,
                }))}
                onChange={(selectedDiscountId) => {
                  const selectedDiscount = discounts.find(
                    (d) => d._id === selectedDiscountId
                  );
                  if (selectedDiscount) {
                    const priceAfter =
                      currentProductPrice *
                      (1 - selectedDiscount.percent_discount / 100);
                    form_edit_product_detail.setFieldsValue({
                      price_after_discount: Math.round(priceAfter),
                    });
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label="Inventory number"
              name="inventory_number"
              rules={[{ required: true, message: "Hãy điền inventory number" }]}
            >
              <InputNumber
                placeholder="Enter inventory number"
                style={{ width: "100%" }}
                min={1}
                precision={0}
              />
            </Form.Item>
            <Form.Item label="Sold number" name="sold_number">
              <InputNumber style={{ width: "100%" }} disabled />
            </Form.Item>
            <Form.Item
              label="Price after discount"
              name="price_after_discount"
              rules={[{ required: true, message: "Please enter price after discount" }]}
            >
              <InputNumber
                placeholder="Auto calculated"
                disabled
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Images"
              name="images"
              rules={[{ required: "true", message: "Please upload at least one image" }]}
            >
              <Upload
                multiple
                listType="picture-card"
                customRequest={handleCustomRequest}
                fileList={fileList}
                onRemove={handleRemove}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Product detail status"
              name="product_detail_status"
              rules={[{ required: true, message: "Please select product detail status" }]}
            >
              <Select
                placeholder="Select product detail status"
                allowClear
                options={product_detail_statuses.map((p) => ({
                  label: p.productdetail_status_name,
                  value: p._id,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Form form={form}>
          <Table
            rowKey="_id"
            dataSource={searchCategory}
            columns={columns}
            loading={{ indicator: loadingIcon, spinning: loading }}
          />
        </Form>
      </div>
    </div>
  );
};

export default ManagerProduct;