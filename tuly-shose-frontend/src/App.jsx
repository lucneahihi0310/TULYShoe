import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Header";
import Header from "./Components/Header";
import HomePage from "./Components/HomePage";
import Footer from "./Components/Footer";
import ProductDetail from "./Components/ProductDetail";
import ListProduct from "./Components/ListProduct";
import ManagerProduct from "./Components/ManagerProduct";
import ManagerHeader from "./Components/ManagerHeader";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* Redirect khi vào /dashboard mặc định về feedbacks */}
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/feedbacks" />}
          />

          {/* Dùng StaffDashboard làm layout chính cho các section */}
          <Route path="/dashboard/:section" element={<StaffDashboard />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
