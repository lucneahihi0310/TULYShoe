// Components/Dashboard/Sidebar.jsx
import React from 'react';
import '../../CSS/Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
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
          onClick={() => setActiveSection(item.key)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
