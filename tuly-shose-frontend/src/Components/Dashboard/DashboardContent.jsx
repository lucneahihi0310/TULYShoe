// Components/Dashboard/DashboardContent.jsx
import React from 'react';
import StaffProductList from '../StaffProducList';
import StaffProfile from '../StaffProfile';

const DashboardContent = ({ activeSection }) => {
  switch (activeSection) {
    // case 'feedbacks':
    //   return <FeedbackList />;
    case 'products':
      return <StaffProductList />;
    // case 'orders':
    //   return <OrderList />;
    // case 'notifications':
    //   return <div>List of Notifications</div>;
    // case 'schedule':
    //   return <div>Work Schedule (Coming soon)</div>;
    case 'profile':
      return <StaffProfile/>;
    default:
      return <div>Welcome to Staff Dashboard</div>;
  }
};

export default DashboardContent;
