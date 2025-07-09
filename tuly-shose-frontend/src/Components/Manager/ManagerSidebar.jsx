import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerSidebar = () => {
    const navigate = useNavigate();

    const menu = [
        { key: 'brands', label: 'Brand Management' },
        { key: 'categories', label: 'Category Management' },
        { key: 'colors', label: 'Color Management' },
        { key: 'forms', label: 'Form Management' },
        { key: 'materials', label: 'Material Management' },
        { key: 'sizes', label: 'Size Management' },
        { key: 'products', label: 'Product Management' }
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
