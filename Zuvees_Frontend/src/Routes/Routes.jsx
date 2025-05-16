import { Navigate, Route, Routes } from "react-router-dom";

import Cart from "../components/Cart/Cart";
import Orders from "../components/Orders/Orders";
import Product from "../components/Product/Product";
import Payment from "../components/Payment/Payment";
import Wishlist from "../components/Wishlist/Wishlist";

import ProductListing from "../components/ProductListing/productListing";
import AdminDashboard from "../components/Dashboards/Admin/AdminDashboard";
import RiderDashboard from "../components/Dashboards/Rider/RiderDashboard";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/products" element={<Product/>} />
      <Route path="/checkout/cart" element={<Cart/>} />
      <Route path="/checkout/payment" element={<Payment />} />
      <Route path="/wishlist" element={<Wishlist/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/rider-dashboard" element={<RiderDashboard />} />
      <Route path="/" element={<ProductListing/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AllRoutes;
