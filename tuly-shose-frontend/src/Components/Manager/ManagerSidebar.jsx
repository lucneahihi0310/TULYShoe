import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ borderRadius: "20px" }}>
            {menu.map((item) => (
                <div
                    key={item.key}
                    className="sidebar-item"
                    onClick={() => navigate(`/manager/${item.key}`)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default ManagerSidebar;
