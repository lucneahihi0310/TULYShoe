import React from 'react'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import './App.css'
import Home from './Components/Header'
import Header from './Components/Header'
import HomePage from './Components/HomePage'
import Footer from './Components/Footer'
import ProductDetail from './Components/ProductDetail'
import ListProduct from './Components/ListProduct'
import ManagerDashboard from './Components/ManagerDashboard'
import ManagerHeader from './Components/ManagerHeader'


function App() {

  return (
    <>
      {/* <Header/> */}
      {/* <HomePage/> */}
      {/* <ProductDetail/> */}
      {/* <ListProduct/> */}
      <ManagerHeader/>
      <ManagerDashboard />
      {/* <Footer/> */}
    </>
  )
}
// import { useState } from 'react';
// import './App.css';
// import StaffDashboard from './Components/StaffDashboard';
// import Notifications from './Components/Notifications';
// import Feedbacks from './Components/Feedbacks';
// import Schedule from './Components/Schedule';
// import Products from './Components/Products';
// import Orders from './Components/Orders';
// import OrderDetail from './Components/OrderDetail';
// import DeliveryStatus from './Components/DeliveryStatus';
// import UpdateStatus from './Components/UpdateStatus';
// import Profile from './Components/Profile';

// function App() {
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const navigateTo = (page) => {
//     setCurrentPage(page);
//     if (page !== 'orderDetail' && page !== 'deliveryStatus') {
//       setSelectedOrder(null);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900 text-White">
//       <nav className="bg-gray-800 p-4 flex flex-wrap justify-center gap-2 mb-4">
//         <button
//           onClick={() => navigateTo('dashboard')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Dashboard
//         </button>
//         <button
//           onClick={() => navigateTo('notifications')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Notifications
//         </button>
//         <button
//           onClick={() => navigateTo('feedbacks')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Feedbacks
//         </button>
//         <button
//           onClick={() => navigateTo('schedule')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Schedule
//         </button>
//         <button
//           onClick={() => navigateTo('products')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Products
//         </button>
//         <button
//           onClick={() => navigateTo('orders')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Orders
//         </button>
//         <button
//           onClick={() => navigateTo('updateStatus')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Update Status
//         </button>
//         <button
//           onClick={() => navigateTo('profile')}
//           className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
//         >
//           Profile
//         </button>
//       </nav>
//       <div className="flex-grow flex items-center justify-center">
//         {currentPage === 'dashboard' && <StaffDashboard />}
//         {currentPage === 'notifications' && <Notifications />}
//         {currentPage === 'feedbacks' && <Feedbacks />}
//         {currentPage === 'schedule' && <Schedule />}
//         {currentPage === 'products' && <Products />}
//         {currentPage === 'orders' && <Orders navigateTo={navigateTo} setSelectedOrder={setSelectedOrder} />}
//         {currentPage === 'orderDetail' && selectedOrder && <OrderDetail order={selectedOrder} />}
//         {currentPage === 'deliveryStatus' && selectedOrder && <DeliveryStatus order={selectedOrder} />}
//         {currentPage === 'updateStatus' && <UpdateStatus />}
//         {currentPage === 'profile' && <Profile />}
//       </div>
//     </div>
//   );
// }

export default App;