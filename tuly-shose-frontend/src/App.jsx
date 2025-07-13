import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "./Components/Other_Screen/Header";
import Footer from "./Components/Other_Screen/Footer";
import HomePage from "./Components/User/HomePage";
import ProductDetail from "./Components/User/ProductDetail";
import ListProduct from "./Components/User/ListProduct";
import StaffDashboard from "./Components/Staff/StaffDashboard/StaffMenu";
import Cart from "./Components/User/Cart_Item";
import Order from "./Components/User/Order";
import LoginRegister from "./Components/Other_Screen/LoginRegister";
import OrderSuccess from "./Components/User/OrderSuccess";
import ManagerDashboard from "./Components/Manager/ManagerDashboard";
import ListProductByOnSale from "./Components/User/ListProductByOnSale";
import OrderDetail from "./Components/User/OrderDetail";
import Profile from "./Components/User/Profile";
import OrderFailure from "./Components/User/OrderFailure";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRegister
              title="Đăng nhập"
              description="Vui lòng đăng nhập để tiếp tục"
              isLogin={true}
            />
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ListProduct />} />
        <Route path="/productsbyonsale" element={<ListProductByOnSale />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderdetail/:orderCode" element={<OrderDetail />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failure" element={<OrderFailure />} />
        <Route path="/profileUser" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route
          path="/manager"
          element={<Navigate to="/manager/brands" replace />}
        />
        <Route
          path="/manager/:section"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/feedbacks" replace />}
        />
        <Route
          path="/dashboard/:section"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
