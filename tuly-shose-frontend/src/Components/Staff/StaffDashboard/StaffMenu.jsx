// Components/Dashboard/StaffDashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import '../../../CSS/StaffDashboard.css';

const StaffDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardContent />
      </div>
    </div>
  );
};


export default StaffDashboard;
