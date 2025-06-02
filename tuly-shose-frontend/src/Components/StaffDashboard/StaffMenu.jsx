// Components/Dashboard/StaffDashboard.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import '../../CSS/StaffDashboard.css';

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState('feedbacks');

  return (
    <div className="dashboard-container">
      <Sidebar setActiveSection={setActiveSection} />
      <DashboardContent activeSection={activeSection} />
    </div>
  );
};

export default StaffDashboard;
