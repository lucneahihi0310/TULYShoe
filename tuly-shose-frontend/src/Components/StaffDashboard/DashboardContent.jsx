// Components/Dashboard/DashboardContent.jsx
import React from 'react';
import StaffProductList from '../StaffMenuList/StaffProducList';
import StaffProfile from '../StaffMenuList/StaffProfile';
import OrderList from '../StaffMenuList/OrderList';
import CustomerFeedback from '../StaffMenuList/CustomerFeedback';

const DashboardContent = ({ activeSection }) => {
  switch (activeSection) {
    case 'feedbacks':
      return <CustomerFeedback />;
    case 'products':
      return <StaffProductList />;
    case 'orders':
      return <OrderList />;
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
