import React from "react";
import { Routes, Route} from "react-router-dom";

import Home from "../pages/Home";
import AllFoods from "../pages/AllFoods";
import FoodDetails from "../pages/FoodDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AccountInfo from "../pages/AccountInfo";
import Dashboard from "../components/Dashboard";
import Product from "../components/Product";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<AllFoods />} />
      <Route path="/foods/:id" element={<FoodDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/AccountInfo" element={<AccountInfo />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="product" element={<Product />} />
        {/* Add other nested routes under Dashboard if needed */}
      </Route>
    </Routes>
  );
};

export default Routers;