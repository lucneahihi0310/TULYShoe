import React from 'react';
import ManagerSidebar from './ManagerSidebar';
import ManagerDashboardContent from './ManagerDashboardContent';

const ManagerDashboard = () => {
    return (
        <div style={{ display: "flex", height: "1000px" }}>
            <ManagerSidebar />
            <ManagerDashboardContent />
        </div>
    );
};

export default ManagerDashboard;