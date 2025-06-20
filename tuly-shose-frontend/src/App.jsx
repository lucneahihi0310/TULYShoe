import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "./Components/Other_Screen/Header";
import Footer from "./Components/Other_Screen/Footer";
import HomePage from "./Components/User/HomePage";
import ProductDetail from "./Components/User/ProductDetail";
import ListProduct from "./Components/User/ListProduct";
import StaffDashboard from "./Components/Staff/StaffDashboard/StaffMenu";
import ManagerProduct from "./Components/Manager/ManagerProduct";
import ManagerCategory from "./Components/Manager/ManagerCategory";
import Cart from "./Components/User/Cart_Item";
import Order from "./Components/User/Order";
import Profile from "./Components/Staff/StaffMenuList/StaffProfile";
import LoginRegister from "./Components/Other_Screen/LoginRegister";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role); // lấy role từ token
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
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
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/manager/product"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/category"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerCategory />
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