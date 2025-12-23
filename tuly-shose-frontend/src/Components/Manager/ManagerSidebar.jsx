import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../CSS/ManagerSiderbar.module.css'
import { SearchOutlined, MinusCircleOutlined, AppstoreOutlined, BarChartOutlined, TeamOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'

const ManagerSidebar = () => {
    const navigate = useNavigate();

    const menu = [
        { key: 'statistic', label: 'Thống Kê', icon: <BarChartOutlined style={{ fontSize: 24 }} /> },
        { key: 'accounts', label: 'Quản Lý Tài Khoản', icon: <UserOutlined style={{ fontSize: 24 }} /> },
        { key: 'staffs', label: 'Quản Lý Nhân Viên', icon: <TeamOutlined style={{ fontSize: 24 }} /> },
        { key: 'orders', label: 'Quản Lý Đơn Hàng', icon: <ShoppingCartOutlined style={{ fontSize: 24 }} /> },
        // { key: 'brands', label: 'Quản lý brand' },
        // { key: 'categories', label: 'Quản lý category' },
        // { key: 'colors', label: 'Quản lý màu sắc' },
        // { key: 'forms', label: 'Quản lý form' },
        // { key: 'genders', label: 'Quản lý gender' },
        // { key: 'materials', label: 'Quản lý vật liệu' },
        // { key: 'sizes', label: 'Quản lý size' },
        { key: 'products', label: 'Quản Lý Sản Phẩm', icon: <AppstoreOutlined style={{ fontSize: 24 }} /> }
    ];

    return (
        <div className={styles.sidebar} style={{ borderRadius: "20px" }}>
            <div className={styles.brand}>
                <img src="/image/logo_trang.png" alt="TULY Shoe" className={styles.brandLogo} />
                <div className={styles.brandText}>
                    <span className={styles.brandTitle}>TULY Shoe</span>
                    <span className={styles.brandSubtitle}>Trang quản lý</span>
                </div>
            </div>
            {menu.map((item) => (
                <div
                    key={item.key}
                    className={styles.sidebarItem}
                    onClick={() => navigate(`/manager/${item.key}`)}
                >
                    {item.icon}
                    <h6 className={styles.sidebarLabel}>{item.label}</h6>
                </div>
            ))}
        </div>
    );
};

export default ManagerSidebar;
