// Components/Dashboard/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ import thêm
import '../../CSS/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate(); // ⬅️ Hook để điều hướng

  const menu = [
    { key: 'feedbacks', label: 'Customer Feedbacks' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'profile', label: 'Profile' }
  ];

  return (
    <div className="sidebar">
      {menu.map((item) => (
        <div
          key={item.key}
          className="sidebar-item"
          onClick={() => navigate(`/dashboard/${item.key}`)} // ⬅️ Điều hướng URL
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
