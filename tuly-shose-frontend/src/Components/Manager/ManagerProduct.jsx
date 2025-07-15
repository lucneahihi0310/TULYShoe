import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, message, InputNumber, Upload } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerProduct = () => {
    // State lưu danh sách dữ liệu tham chiếu từ các bảng liên quan
    const [categories, setCategories] = useState([]);
    const [categories_2, setCategories_2] = useState([]);
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [forms, setForms] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [product_detail_statuses, setProduct_detail_statuses] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [product_detail_by_ids, setProduct_detail_by_ids] = useState([]);

    // State khác
    const [edittingRow, setEdittingRow] = useState(null);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [addCategory, setAddCategory] = useState(false);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form_add_product_detail] = Form.useForm();
    // const [messageApi, contextHolder] = message.useMessage();
    const [listProductDetail, setListProductDetail] = useState(false);
    const [addProductDetail, setAddProductDetail] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [currentProductPrice, setCurrentProductPrice] = useState(0);

    // State cho upload ảnh
    const [imageUrls, setImageUrls] = useState([]);
    const [fileList, setFileList] = useState([]);

    // Hàm upload lên Cloudinary
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'product-detail-images'); // sửa thành upload_preset của bạn
        const res = await fetch('https://api.cloudinary.com/v1_1/drpiifgqs/image/upload', {
            method: 'POST',
            body: data,
        });
        const json = await res.json();
        if (json.secure_url) return json.secure_url;
        throw new Error('Upload failed');
    };

    // Handler customRequest cho AntD Upload
    const handleCustomRequest = async ({ file, onSuccess, onError }) => {
        try {
            const url = await uploadToCloudinary(file);
            setImageUrls(prev => [...prev, url]);
            setFileList(prev => [...prev, { uid: url, name: file.name, status: 'done', url }]);
            onSuccess(null, file);
        } catch (err) {
            console.error(err);
            message.error('Upload failed');
            onError(err);
        }
    };

    // Khi bấm xóa ảnh preview
    const handleRemove = (file) => {
        setImageUrls(prev => prev.filter(u => u !== file.url));
        setFileList(prev => prev.filter(f => f.url !== file.url));
    };

    //show add category
    const showAddCategoryModal = () => {
        setAddCategory(true);
    };

    //cancel add category
    const handleCancelAddCategory = () => {
        setAddCategory(false);
        form2.resetFields();
    };

    //edit category
    const handleEditCategory = async () => {
        try {
            const record = await form.validateFields();
            console.log("Edit:", record);
            await updateData('products/manager/edit_product', edittingRow, {
                productName: record.productName,
                description: record.description,
                price: record.price,
                categories_id: record.categories_id,
                brand_id: record.brand_id,
                material_id: record.material_id,
                form_id: record.form_id
            }, true);
            setEdittingRow(null);
            fetchCategories();
            console.log("edit")
        }
        catch (error) {
            console.log(error);
        }
    };

    //cancel edit category
    const handleCancelEdit = () => {
        setEdittingRow(null);
    }

    //delete category
    const handleDeleteCategory = async (id) => {
        console.log("Delete : ", id);
        await deleteData('/products/manager/delete_product', id, true);
        fetchCategories();
        console.log("delete")
    };

    const showProductDetail = async (productId, record) => {
        const res = await fetchData(`/product_details/manager/list_product_detail_by_id/${productId}`);
        // console.log(res);
        setDetailData(res);
        setCurrentProductPrice(record.price);
        setCurrentProductId(productId);
        setListProductDetail(true);
    };

    //cancel add category
    const handleCancelShowProductDetail = () => {
        setListProductDetail(false);
    };

    //fetch data và filter category
    useEffect(() => {
        fetchCategories();
        fetchCategories_2();
        fetchBrands();
        fetchMaterials();
        fetchForms();
        fetchColors();
        fetchSizes();
        fetchDiscounts();
        fetchProductDetailStatuses();
        // fetchProductDetails(currentProductId);
    }, [])
    const fetchCategories = async () => {
        const res = await fetchData('/products/manager/list_product');
        setCategories(res);
    }
    const fetchCategories_2 = async () => {
        const res = await fetchData('/categories/manager/list_category');
        setCategories_2(res);
    }
    const fetchBrands = async () => {
        const res = await fetchData('/brands/manager/list_brand');
        setBrands(res);
    }
    const fetchMaterials = async () => {
        const res = await fetchData('/materials/manager/list_material');
        setMaterials(res);
    }
    const fetchForms = async () => {
        const res = await fetchData('/forms/manager/list_form');
        setForms(res);
    }
    const fetchColors = async () => {
        const res = await fetchData('/colors/manager/list_color');
        setColors(res);
    }
    const fetchSizes = async () => {
        const res = await fetchData('/sizes/manager/list_size');
        setSizes(res);
    }
    const fetchDiscounts = async () => {
        const res = await fetchData('/discounts/manager/list_discount');
        setDiscounts(res);
    }
    const fetchProductDetailStatuses = async () => {
        const res = await fetchData('/product_detail_status/manager/list_product_detail_status');
        setProduct_detail_statuses(res);
    }
    // const fetchProductDetails = async (productId) => {
    //     const res = await fetchData(`/product_details/manager/list_product_detail_by_id/${productId}`);
    //     setProduct_detail_by_ids(res);
    // }
    const searchCategory = categories.filter((c) => {
        const findCategoryByName = c.productName.toLowerCase().includes(filterCategoryName.toLowerCase());
        return findCategoryByName;
    })

    //setup các column
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: 50,
            render: (text, record, index) => index + 1
        },

        {
            title: 'Product name',
            dataIndex: 'productName',
            key: 'productName',
            width: 200,
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="productName"
                            rules={[
                                { required: true, message: "Please enter product name" },
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="title"
                            rules={[
                                { required: true, message: "Please enter title" },
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="description"
                            rules={[
                                { required: true, message: "Please enter product description" },
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Product info',
            key: 'info',
            render: (_, record) => {
                if (record._id == edittingRow) {
                    return (
                        <>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: "Please enter product price" }
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Category"
                                name="categories_id"
                                // initialValue={record.}
                                rules={[{ required: true, message: "Please select category" }]}>
                                <Select
                                    placeholder="Select category"
                                    allowClear
                                    options={categories_2.map((p) => {
                                        return {
                                            label: p.category_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Brand"
                                name="brand_id"
                                rules={[{ required: true, message: "Please select brand" }]}>
                                <Select
                                    placeholder="Select brand"
                                    allowClear
                                    options={brands.map((p) => {
                                        return {
                                            label: p.brand_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Material"
                                name="material_id"
                                rules={[{ required: true, message: "Please select material" }]}>
                                <Select
                                    placeholder="Select material"
                                    allowClear
                                    options={materials.map((p) => {
                                        return {
                                            label: p.material_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Form"
                                name="form_id"
                                initialValue={record.form_id}
                                rules={[{ required: true, message: "Please select form" }]}>
                                <Select
                                    placeholder="Select form"
                                    allowClear
                                    options={forms.map((p) => {
                                        return {
                                            label: p.form_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>
                        </>
                    )
                }
                else {
                    return (
                        <div>
                            <div>
                                Price : {record.price}
                            </div>
                            <div>
                                Category name : {record.categories_id.category_name}
                            </div>
                            <div>
                                Brand name : {record.brand_id.brand_name}
                            </div>
                            <div>
                                Material name : {record.material_id.material_name}
                            </div>
                            <div>
                                Form name : {record.form_id.form_name}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            title: 'Create date',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 200
        },
        {
            title: 'Update date',
            dataIndex: 'update_at',
            key: 'update_at',
            width: 200
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const isEditting = edittingRow == record._id;
                return isEditting ? (
                    <Space>
                        <Button
                            color="primary"
                            variant="solid"
                            onClick={() => {
                                handleEditCategory()
                            }}>
                            Save
                        </Button>

                        <Button
                            color="danger"
                            variant="solid"
                            onClick={() => {
                                handleCancelEdit();
                            }}>
                            Cancel
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <div>
                            <Row>
                                <Button
                                    style={{ margin: '5px' }}
                                    color="primary"
                                    variant="solid"
                                    icon={<UnorderedListOutlined />}
                                    onClick={() => {
                                        showProductDetail(record._id, record);
                                        console.log(record);
                                    }}>
                                    Product Detail
                                </Button>
                                <Modal
                                    title="List product detail"
                                    closable={{ 'aria-label': 'Custom Close Button' }}
                                    open={listProductDetail}
                                    onCancel={() => {
                                        handleCancelShowProductDetail()
                                    }}
                                    footer={null}
                                    width={800}
                                >
                                    <Button
                                        style={{ width: '200px', marginBottom: '15px' }}
                                        shape="round"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            form_add_product_detail.setFieldsValue({
                                                product_id: currentProductId
                                            });
                                            setAddProductDetail(true);
                                        }}>
                                        Add New Product Detail
                                    </Button>
                                    <Modal
                                        title="Add Product Detail"
                                        closable={{ 'aria-label': 'Custom Close Button' }}
                                        open={addProductDetail}
                                        onCancel={() => setAddProductDetail(false)}
                                        footer={null}
                                        width={800}
                                    >
                                        <Form
                                            form={form_add_product_detail}
                                            name="wrap"
                                            labelCol={{ flex: '110px' }}
                                            labelAlign="left"
                                            labelWrap
                                            wrapperCol={{ flex: 1 }}
                                            colon={false}
                                            onFinish={async (values) => {
                                                // gọi API postData(...)
                                                const payload = {
                                                    product_id: values.product_id,
                                                    color_id: values.color,
                                                    size_id: values.size,
                                                    discount_id: values.discount,
                                                    inventory_number: values.inventory_number,
                                                    sold_number: values.sold_number,
                                                    price_after_discount: values.price_after_discount,
                                                    product_detail_status: values.product_detail_status,
                                                    images: imageUrls,  // <-- đây là mảng URL ảnh
                                                };
                                                await postData('/product_details/manager/create_product_detail', payload, true);
                                                form_add_product_detail.resetFields();
                                                console.log(values);
                                                showProductDetail(currentProductId, {
                                                    price: currentProductPrice
                                                });
                                            }}
                                        >
                                            <Form.Item
                                                label="Id sản phẩm"
                                                name="product_id"
                                                rules={[
                                                    { required: true, message: "Please enter product name" }
                                                ]}>
                                                <Input disabled placeholder="Enter product name" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Color"
                                                name="color"
                                                rules={[{ required: true, message: "Please select color" }]}>
                                                <Select
                                                    placeholder="Select color"
                                                    allowClear
                                                    options={colors.map((c) => {
                                                        return {
                                                            label: (
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                                                            value: c._id
                                                        }
                                                    })}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Size"
                                                name="size"
                                                rules={[{ required: true, message: "Please select size" }]}>
                                                <Select
                                                    placeholder="Select size"
                                                    allowClear
                                                    options={sizes.map((s) => {
                                                        return {
                                                            label: s.size_name,
                                                            value: s._id
                                                        }
                                                    })}
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
                                                        value: d._id
                                                    }))}
                                                    onChange={(selectedDiscountId) => {
                                                        const selectedDiscount = discounts.find((d) => d._id === selectedDiscountId);
                                                        if (selectedDiscount) {
                                                            const priceAfter = currentProductPrice * (1 - selectedDiscount.percent_discount / 100);
                                                            form_add_product_detail.setFieldsValue({
                                                                price_after_discount: Math.round(priceAfter)
                                                            });
                                                        }
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Inventory number"
                                                name="inventory_number"
                                                rules={[
                                                    { required: true, message: "Hãy điền inventory number" }
                                                ]}
                                            >
                                                <InputNumber
                                                    placeholder="Enter inventory number"
                                                    style={{ width: "100%" }}
                                                    min={1}
                                                    precision={0} // ép thành số nguyên, không cho nhập số thập phân
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Sold number"
                                                name="sold_number"
                                                rules={[
                                                    { required: true, message: "Please enter sold number" },
                                                ]}>
                                                <InputNumber
                                                    placeholder="Enter sold number"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Price after discount"
                                                name="price_after_discount"
                                                rules={[{ required: true, message: "Please enter price after discount" }]}
                                            >
                                                <InputNumber
                                                    placeholder="Auto calculated"
                                                    disabled
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>

                                            {/* lưu ảnh */}

                                            <Form.Item
                                                label="Images"
                                                name="images"
                                                rules={[{ required: true, message: 'Please upload at least one image' }]}
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
                                                rules={[{ required: true, message: "Please select product detail status" }]}>
                                                <Select
                                                    placeholder="Select product detail status"
                                                    allowClear
                                                    options={product_detail_statuses.map((p) => {
                                                        return {
                                                            label: p.productdetail_status_name,
                                                            value: p._id
                                                        }
                                                    })}
                                                />
                                            </Form.Item>
                                            {/* <Form.Item
                                            </Form.Item> */}
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Submit
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Modal>

                                    {detailData.length > 0 ? (
                                        <Table
                                            rowKey="_id"
                                            dataSource={detailData}
                                            pagination={false}
                                            columns={[
                                                {
                                                    title: 'No',
                                                    key: 'no',
                                                    render: (text, _, index) => index + 1
                                                },
                                                {
                                                    title: 'Tên sản phẩm',
                                                    dataIndex: ['product_id', 'productName'],
                                                    key: 'productName'
                                                },
                                                {
                                                    title: 'Ảnh',
                                                    key: 'image',
                                                    render: (_, record) => {
                                                        return (
                                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                                {record.images?.map((img, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={img}
                                                                        alt={`img-${index}`}
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 6 }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )
                                                    }
                                                },
                                                {
                                                    title: 'Thông tin',
                                                    key: 'info',
                                                    render: (_, record) => {
                                                        return (
                                                            <div>
                                                                <div>
                                                                    Color: {record.color_id.color_code}
                                                                </div>
                                                                <div>
                                                                    Size: {record.size_id.size_name}
                                                                </div>
                                                                <div>
                                                                    Discount: {record.discount_id.percent_discount}
                                                                </div>
                                                                <div>
                                                                    Inventory number: {record.inventory_number}
                                                                </div>
                                                                <div>
                                                                    Sold number: {record.sold_numer}
                                                                </div>
                                                                <div>
                                                                    Price after discount: {record.price_after_discount}
                                                                </div>
                                                                <div>
                                                                    Product detail status: {record.product_detail_status.productdetail_status_name}
                                                                </div>
                                                                <div>
                                                                    Create at: {record.create_at}
                                                                </div>
                                                                <div>
                                                                    Update at: {record.update_at}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                }
                                            ]}
                                        />
                                    ) : (
                                        <p>Không có chi tiết cho sản phẩm này.</p>
                                    )}
                                </Modal>
                            </Row>
                            <Row>
                                <Button
                                    style={{ margin: '5px' }}
                                    color="yellow"
                                    variant="solid"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setEdittingRow(record._id);
                                        console.log(record);
                                        form.setFieldsValue({
                                            productName: record.productName,
                                            title: record.title,
                                            description: record.description,
                                            price: record.price,
                                            categories_id: record.categories_id._id,
                                            brand_id: record.brand_id._id,
                                            material_id: record.material_id._id,
                                            form_id: record.form_id._id
                                        })
                                    }}>
                                    Edit
                                </Button>
                            </Row>
                            <Row>
                                <Popconfirm
                                    title="Are you sure to delete this category?"
                                    onConfirm={() => {
                                        handleDeleteCategory(record._id)
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ size: 'small', style: { width: "110px" } }}    // Đặt kích thước nhỏ cho nút "Yes"
                                    cancelButtonProps={{ size: 'small', style: { width: "110px" } }} // Đặt kích thước nhỏ cho nút "No"
                                >
                                    <Button
                                        style={{ margin: '5px' }}
                                        color="danger"
                                        variant="solid"
                                        icon={<DeleteOutlined />}>
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </Row>
                        </div>
                    </Space >
                )
            }
        }
    ];
    return (
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Products</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search product..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategoryName(e.target.value)} />
                </Col>
                <Col span={4} offset={4}>
                    <Button
                        shape="round"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            showAddCategoryModal();
                        }}>
                        Add New Product
                    </Button>
                    <Modal
                        title="Add new product"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={addCategory}
                        onCancel={() => {
                            handleCancelAddCategory()
                        }}
                        footer={null}>
                        <Form
                            form={form2}
                            name="wrap"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                            onFinish={async (values) => {
                                try {
                                    console.log(values);
                                    await postData('/products/manager/create_product', {
                                        productName: values.productName,
                                        title: values.title,
                                        description: values.description,
                                        price: values.price,
                                        categories_id: values.categories_id,
                                        brand_id: values.brand_id,
                                        material_id: values.material_id,
                                        form_id: values.form_id
                                    }, true);
                                    form2.resetFields();
                                    setAddCategory(false);
                                    fetchCategories();
                                    // message.success({
                                    //     content: "Add product successfully!",
                                    //     duration: 2
                                    // })
                                    // message.success("Add product successfully!");
                                    // messageApi.open({
                                    //     type: 'success',
                                    //     content: 'This is a success message',
                                    // });
                                } catch (error) {
                                    console.log(error)
                                }
                            }}

                        // onFinish={(values) => {
                        //     console.log(values)
                        // }}
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
                                                    cat.productName.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                    cat._id !== edittingRow
                                            );
                                            return isDuplicate
                                                ? Promise.reject("This product name already exists!")
                                                : Promise.resolve();
                                        }
                                    }
                                ]}>
                                <Input placeholder="Enter product name" />
                            </Form.Item>

                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    { required: true, message: "Please enter title" },
                                    {
                                        validator: (_, value) => {
                                            const isDuplicate = categories.some(
                                                (cat) =>
                                                    cat.title.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                    cat._id !== edittingRow
                                            );
                                            return isDuplicate
                                                ? Promise.reject("This title already exists!")
                                                : Promise.resolve();
                                        }
                                    }
                                ]}>
                                <Input placeholder="Enter title" />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    { required: true, message: "Please enter description" },
                                ]}>
                                <Input placeholder="Enter description" />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: "Please enter price" },
                                ]}>
                                <Input placeholder="Enter product name" />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="categories_id"
                                rules={[{ required: true, message: "Please select category" }]}>
                                <Select
                                    placeholder="Select category"
                                    allowClear
                                    options={categories_2.map((p) => {
                                        return {
                                            label: p.category_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Brand"
                                name="brand_id"
                                rules={[{ required: true, message: "Please select brand" }]}>
                                <Select
                                    placeholder="Select brand"
                                    allowClear
                                    options={brands.map((p) => {
                                        return {
                                            label: p.brand_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Material"
                                name="material_id"
                                rules={[{ required: true, message: "Please select material" }]}>
                                <Select
                                    placeholder="Select material"
                                    allowClear
                                    options={materials.map((p) => {
                                        return {
                                            label: p.material_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Form"
                                name="form_id"
                                rules={[{ required: true, message: "Please select form" }]}>
                                <Select
                                    placeholder="Select form"
                                    allowClear
                                    options={forms.map((p) => {
                                        return {
                                            label: p.form_name,
                                            value: p._id
                                        }
                                    })}
                                />
                            </Form.Item>

                            <Form.Item
                                label=" ">
                                <Button
                                    type="primary"
                                    htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
            <div justify={"center"} align={"middle"}>
                <Form form={form}>
                    <Table rowKey="_id" dataSource={searchCategory} columns={columns} />
                </Form>
            </div>
        </div>
    );
};

export default ManagerProduct;