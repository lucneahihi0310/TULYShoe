// Components/Dashboard/DashboardContent.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StaffProductList from '../StaffMenuList/StaffProducList';
import CustomerFeedback from '../StaffMenuList/CustomerFeedback';
import StaffProfile from '../StaffMenuList/StaffProfile';
import OrderList from '../StaffMenuList/OrderList';
import NotificationList from '../StaffMenuList/NotificationsList';
import ScheduleCalendar from '../StaffMenuList/Schedule';
import DashboardOverview from '../StaffMenuList/DashboardOverview';
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
      case 'notifications':
      return <NotificationList />;
      case 'schedule':
      return <ScheduleCalendar />;
      case 'dashboard':
      return <DashboardOverview/>;
    default:
      return <div>Welcome to Staff Dashboard</div>;
  }
};

export default DashboardContent;
