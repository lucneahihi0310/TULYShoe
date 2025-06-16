import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Other_Screen/Header";
import Footer from "./Components/Other_Screen/Footer";
import HomePage from "./Components/User/HomePage";
import ProductDetail from "./Components/User/ProductDetail";
import ListProduct from "./Components/User/ListProduct";
import StaffDashboard from "./Components/Staff/StaffDashboard/StaffMenu";
import ManagerProduct from "./Components/Manager/ManagerProduct";
import ManagerCategory from "./Components/Manager/ManagerCategory";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ListProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/manager/product" element={<ManagerProduct />} />
        <Route path="/manager/category" element={<ManagerCategory />} />
        {/* các Route khác */}
        {/* Redirect khi vào /dashboard mặc định về feedbacks */}
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/feedbacks" replace />}
        />
        {/* Dùng StaffDashboard làm layout chính cho các section */}
        <Route path="/dashboard/:section" element={<StaffDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
