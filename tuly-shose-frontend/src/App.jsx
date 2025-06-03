import React from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import './App.css'
import Home from "./Components/Header";
import Header from "./Components/Header";

import Footer from "./Components/Footer";
import StaffDashboard from "./Components/StaffDashboard/StaffMenu";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
