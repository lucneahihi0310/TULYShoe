import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerProduct = () => {
    // State lưu danh sách dữ liệu tham chiếu từ các bảng liên quan
    const [categories, setCategories] = useState([]);
    const [categories_2, setCategories_2] = useState([]);
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [forms, setForms] = useState([]);
    //
    const [edittingRow, setEdittingRow] = useState(null);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [filterCategoryStatus, setFilterCategoryStatus] = useState(undefined);
    const [addCategory, setAddCategory] = useState(false);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

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

            // await axios.put(`http://localhost:9999/manager/categories/edit/${edittingRow}`, {
            //     category_name: record.category_name,
            //     is_active: record.status
            // });

            // await updateData('products/manager/edit_product', edittingRow, {
            //     xax
            // });
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
        // console.log("Delete : ", id);
        // await axios.delete(`http://localhost:9999/manager/categories/delete/${id}`);
        // fetchCategories();

        console.log("delete")
    };

    //fetch data và filter category
    useEffect(() => {
        fetchCategories();
        fetchCategories_2();
        fetchBrands();
        fetchMaterials();
        fetchForms()
    }, [])
    const fetchCategories = async () => {
        // const res = await axios.get(`http://localhost:9999/manager/products`);
        const res = await fetchData('/products/manager/list_product');
        setCategories(res);
        console.log('product');
    }
    const fetchCategories_2 = async () => {
        // const res = await axios.get(`http://localhost:9999/manager/categories`);
        const res = await fetchData('/categories/manager/list_category');
        setCategories_2(res);
        console.log('category');
    }
    const fetchBrands = async () => {
        // const res = await axios.get(`http://localhost:9999/manager/brands`);
        const res = await fetchData('/brands/manager/list_brand');
        setBrands(res);
        console.log('brand');
    }
    const fetchMaterials = async () => {
        // const res = await axios.get(`http://localhost:9999/manager/materials`);
        const res = await fetchData('/materials/manager/list_material');
        setMaterials(res);
        console.log('material');
    }
    const fetchForms = async () => {
        // const res = await axios.get(`http://localhost:9999/manager/forms`);
        const res = await fetchData('/forms/manager/list_forms');
        setForms(res);
        console.log('form');
    }
    const searchCategory = categories.filter((c) => {
        const findCategoryByName = c.productName.toLowerCase().includes(filterCategoryName.toLowerCase());
        return findCategoryByName;
    })

    //setup các column
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id'
        },
        {
            title: 'Product name',
            dataIndex: 'productName',
            key: 'productName',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
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
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="description"
                            rules={[
                                { required: true, message: "Please enter product description" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.description.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This product description already exists!")
                                            : Promise.resolve();
                                    }
                                }
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
            title: 'Product price',
            dataIndex: 'price',
            key: 'price',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="price"
                            rules={[
                                { required: true, message: "Please enter product price" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.price.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This product price already exists!")
                                            : Promise.resolve();
                                    }
                                }
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
            title: 'Category',
            dataIndex: 'categories_id',
            key: 'categories_id',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="categories_id"
                            rules={[
                                { required: true, message: "Please enter category name" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.categories_id.category_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This category name already exists!")
                                            : Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value.category_name}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Brand',
            dataIndex: 'brand_id',
            key: 'brand_id',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="brand_id"
                            rules={[
                                { required: true, message: "Please enter product name" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.brand_id.brand_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This product name already exists!")
                                            : Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value.brand_name}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Material',
            dataIndex: 'material_id',
            key: 'material_id',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="material_id"
                            rules={[
                                { required: true, message: "Please enter material name" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.material_id.material_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This material name already exists!")
                                            : Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value.material_name}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Form',
            dataIndex: 'form_id',
            key: 'form_id',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="form_id"
                            rules={[
                                { required: true, message: "Please enter form name" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.form_id.form_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This form name already exists!")
                                            : Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value.form_name}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Create date',
            dataIndex: 'create_at',
            key: 'create_at'
        },
        {
            title: 'Update date',
            dataIndex: 'update_at',
            key: 'update_at'
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
                    <Space  >
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEdittingRow(record._id);
                                form.setFieldsValue({
                                    productName: record.productName,
                                    description: record.description,
                                    price: record.price,
                                    categories_id: record.categories_id,
                                    brand_id: record.brand_id,
                                    material_id: record.material_id,
                                    form_id: record.form_id
                                })
                            }}>
                            Edit
                        </Button>
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
                                color="danger"
                                variant="solid"
                                icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
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
                        shape="round" icon={<PlusOutlined />}
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
                                    // await axios.post('http://localhost:9999/manager/products/create', {
                                    //     productName: values.productName,
                                    //     description: values.description,
                                    //     price: values.price,
                                    //     categories_id: values.categories_id,
                                    //     brand_id: values.brand_id,
                                    //     material_id: values.material_id,
                                    //     form_id: values.form_id
                                    // });
                                    await postData('/products/manager/create_product', {
                                        productName: values.productName,
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
                                    messageApi.open({
                                        type: 'success',
                                        content: 'This is a success message',
                                    });
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
                                    // options={[
                                    //     { label: 'Active', value: true },
                                    //     { label: 'Inactive', value: false }
                                    // ]}
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
                                    // options={[
                                    //     { label: 'Active', value: true },
                                    //     { label: 'Inactive', value: false }
                                    // ]}
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
                                    // options={[
                                    //     { label: 'Active', value: true },
                                    //     { label: 'Inactive', value: false }
                                    // ]}
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
                                    // options={[
                                    //     { label: 'Active', value: true },
                                    //     { label: 'Inactive', value: false }
                                    // ]}
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