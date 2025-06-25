import React from 'react';
import ManagerSidebar from './ManagerSidebar';
import ManagerDashboardContent from './ManagerDashboardContent';
import { Col, Row } from 'antd';

const ManagerDashboard = () => {
    return (
        <div style={{ display: "flex", height: "835px" }}>
            <ManagerSidebar />
            <ManagerDashboardContent />
        </div>
    );
};

export default ManagerDashboard;