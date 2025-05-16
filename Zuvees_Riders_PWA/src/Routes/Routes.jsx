import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import RiderDashboard from "../components/Dashboards/Rider/RiderDashboard";
import Home from "../components/Home/Home";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RiderDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AllRoutes;
