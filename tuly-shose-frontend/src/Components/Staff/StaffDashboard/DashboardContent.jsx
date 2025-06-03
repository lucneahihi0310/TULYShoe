// Components/Dashboard/DashboardContent.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StaffProductList from '../StaffMenuList/StaffProducList';
import CustomerFeedback from '../StaffMenuList/CustomerFeedback';
import StaffProfile from '../StaffMenuList/StaffProfile';
import OrderList from '../StaffMenuList/OrderList';
const DashboardContent = () => {
  const { section } = useParams();

  switch (section) {
    case 'feedbacks':
      return <CustomerFeedback />;
    case 'products':
      return <StaffProductList />;
    case 'orders':
      return <OrderList />;
    case 'profile':
      return <StaffProfile />;
    default:
      return <div>Welcome to Staff Dashboard</div>;
  }
};

export default DashboardContent;
