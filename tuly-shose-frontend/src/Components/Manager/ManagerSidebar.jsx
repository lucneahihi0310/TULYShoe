import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../CSS/ManagerSiderbar.module.css'

const ManagerSidebar = () => {
    const navigate = useNavigate();

    const menu = [
        { key: 'statistic', label: 'Thống kê' },
        { key: 'accounts', label: 'Quản lý tài khoản' },
        { key: 'staffs', label: 'Quản lý nhân viên' },
        { key: 'orders', label: 'Quản lý order' },
        // { key: 'brands', label: 'Quản lý brand' },
        // { key: 'categories', label: 'Quản lý category' },
        // { key: 'colors', label: 'Quản lý màu sắc' },
        // { key: 'forms', label: 'Quản lý form' },
        // { key: 'genders', label: 'Quản lý gender' },
        // { key: 'materials', label: 'Quản lý vật liệu' },
        // { key: 'sizes', label: 'Quản lý size' },
        { key: 'products', label: 'Quản lý sản phẩm' }
    ];

    return (
        <div className={styles.sidebar} style={{ borderRadius: "20px" }}>
            {menu.map((item) => (
                <div
                    key={item.key}
                    className={styles.sidebarItem}
                    onClick={() => navigate(`/manager/${item.key}`)}
                >
                    <h6>{item.label}</h6>
                </div>
            ))}
        </div>
    );
};

export default ManagerSidebar;
