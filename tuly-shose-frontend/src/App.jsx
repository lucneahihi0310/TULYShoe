import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Components/API/AuthContext";
import { Spin } from "antd";
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
import AboutUs from "./Components/User/AboutUs";
import Instruct from "./Components/User/Instruct";
import OrderSearch from "./Components/User/OrderSearch";
import StaffProfile from "./Components/Staff/StaffMenuList/StaffProfile";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu sản phẩm..." />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const { user, isAuthLoading } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthLoading ? (
              <Spin fullscreen />
            ) : user ? (
              user.role === "manager" ? (
                <Navigate to="/manager/brands" replace />
              ) : user.role === "staff" ? (
                <Navigate to="/dashboard/feedbacks" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <LoginRegister />
            )
          }
        />

        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/products" element={<ListProduct />} />
        <Route path="/productsbyonsale" element={<ListProductByOnSale />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderdetail/:orderCode" element={<OrderDetail />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failure" element={<OrderFailure />} />
        <Route path="/profileUser" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/instruct" element={<Instruct />} />
        <Route path="/order-search" element={<OrderSearch />} />
        <Route path="/profile" element={<StaffProfile />} />

        <Route
          path="/manager"
          element={<Navigate to="/manager/statistic" replace />}
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

      {!isAuthLoading && user?.role !== "staff" && user?.role !== "manager" && (
        <Footer />
      )}
    </BrowserRouter>
  );
}

export default App;
