import React from 'react';
import ManagerSidebar from './ManagerSidebar';
import ManagerDashboardContent from './ManagerDashboardContent';
import { Col, Row } from 'antd';

const ManagerDashboard = () => {
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{width: '200px'}}>
                <ManagerSidebar />
            </div>
            <div style={{ width: '100%' }}>
                <ManagerDashboardContent />
            </div>
        </div>
    );
};

export default ManagerDashboard;