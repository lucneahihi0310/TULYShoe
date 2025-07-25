import React, { useState, useEffect } from "react";
import { Col, Row, Select, Card, Table, Spin, DatePicker } from "antd";
import { fetchData } from "../API/ApiService";
import moment from "moment";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ManagerStatistic = () => {
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState("day");
    const [customDateRange, setCustomDateRange] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);

    // Fetch revenue data
    const fetchRevenueData = async (range, startDate, endDate) => {
        setLoading(true);
        try {
            let start, end;
            const now = moment();

            if (range === "custom" && startDate && endDate) {
                start = startDate.startOf("day").toDate();
                end = endDate.endOf("day").toDate();
            } else {
                switch (range) {
                    case "day":
                        start = now.startOf("day").toDate();
                        end = now.endOf("day").toDate();
                        break;
                    case "week":
                        start = now.startOf("week").toDate();
                        end = now.endOf("week").toDate();
                        break;
                    case "month":
                        start = now.startOf("month").toDate();
                        end = now.endOf("month").toDate();
                        break;
                    default:
                        start = now.startOf("day").toDate();
                        end = now.endOf("day").toDate();
                }
            }

            const orders = await fetchData(
                `/staff/orders?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
                true
            );

            const revenueByDate = {};
            orders.formattedOrders.forEach((order) => {
                if (order.order_status !== "Đã hủy") {
                    const date = moment(order.order_date).format(
                        range === "day" ? "HH:mm" : "YYYY-MM-DD"
                    );
                    revenueByDate[date] = (revenueByDate[date] || 0) + order.total_amount;
                }
            });

            const chartData = Object.keys(revenueByDate)
                .map((date) => ({
                    date,
                    revenue: revenueByDate[date],
                }))
                .sort((a, b) => (range === "day" ? a.date.localeCompare(b.date) : moment(a.date).diff(moment(b.date))));

            setRevenueData(chartData);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch top-selling products
    const fetchTopProducts = async () => {
        setLoading(true);
        try {
            const products = await fetchData(
                "/products/customers/listproducts?sortBy=sold-desc&limit=5",
                true
            );
            const topProductsData = products.data.map((product) => ({
                key: product._id,
                productName: product.productName,
                sold: product.detail.sold_number || 0,
                price: product.detail.price_after_discount || product.price,
                revenue: (product.detail.price_after_discount || product.price) * (product.detail.sold_number || 0),
            }));
            setTopProducts(topProductsData);
        } catch (error) {
            console.error("Error fetching top products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch inventory data
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const inventory = await fetchData("/staff/inventory", true);
            const inventoryData = inventory.data.map((item) => ({
                key: item.productDetailId,
                productName: item.productName,
                inventory_number: item.inventory_number,
                price: item.price_after_discount,
                status: item.product_detail_status,
            }));
            setInventoryData(inventoryData);
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle time range change
    const handleTimeRangeChange = (value) => {
        setTimeRange(value);
        if (value !== "custom") {
            setCustomDateRange([]);
            fetchRevenueData(value);
        }
    };

    // Handle custom date range change
    const handleDateRangeChange = (dates) => {
        setCustomDateRange(dates);
        if (dates && dates.length === 2) {
            fetchRevenueData("custom", dates[0], dates[1]);
        }
    };

    useEffect(() => {
        fetchRevenueData(timeRange);
        fetchTopProducts();
        fetchInventory();
    }, []);

    // Table columns for top products
    const topProductsColumns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Số lượng bán",
            dataIndex: "sold",
            key: "sold",
            sorter: (a, b) => a.sold - b.sold,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString()} ₫`,
        },
        {
            title: "Doanh thu",
            dataIndex: "revenue",
            key: "revenue",
            render: (revenue) => `${revenue.toLocaleString()} ₫`,
            sorter: (a, b) => a.revenue - b.revenue,
        },
    ];

    // Table columns for inventory
    const inventoryColumns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Số lượng tồn kho",
            dataIndex: "inventory_number",
            key: "inventory_number",
            sorter: (a, b) => a.inventory_number - b.inventory_number,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price.toLocaleString()} ₫`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
    ];

    return (
        <div style={{ padding: "20px", backgroundColor: "#f7f9fa", minHeight: "100vh" }}>
            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title="Báo cáo doanh thu" bordered={false}>
                            <Row gutter={16} style={{ marginBottom: 16 }}>
                                <Col span={8}>
                                    <Select
                                        value={timeRange}
                                        onChange={handleTimeRangeChange}
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="day">Theo ngày</Option>
                                        <Option value="week">Theo tuần</Option>
                                        <Option value="month">Theo tháng</Option>
                                        <Option value="custom">Tùy chỉnh</Option>
                                    </Select>
                                </Col>
                                {timeRange === "custom" && (
                                    <Col span={16}>
                                        <RangePicker
                                            value={customDateRange}
                                            onChange={handleDateRangeChange}
                                            format="DD/MM/YYYY"
                                        />
                                    </Col>
                                )}
                            </Row>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        label={{
                                            value: timeRange === "day" ? "Giờ" : "Ngày",
                                            position: "insideBottom",
                                            offset: -5,
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: "Doanh thu (₫)",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Sản phẩm bán chạy nhất" bordered={false}>
                            <Table
                                columns={topProductsColumns}
                                dataSource={topProducts}
                                pagination={false}
                                rowKey="key"
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Tồn kho" bordered={false}>
                            <Table
                                columns={inventoryColumns}
                                dataSource={inventoryData}
                                pagination={{ pageSize: 5 }}
                                rowKey="key"
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default ManagerStatistic;