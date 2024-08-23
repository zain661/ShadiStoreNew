import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import GlobalStyles from "./GlobalStyles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/VerifyEmail";
import Login from "./Pages/Login";
import Policy from "./Pages/Policy";

function App() {
  return (
    <div>
      <BrowserRouter>
        <GlobalStyles />
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/womens" element={<ShopCategory category="women" />} />
          <Route path="/turath" element={<ShopCategory category="turath" />} />
          <Route path="/arek" element={<ShopCategory category="arek" />} />
          <Route path="/jacket" element={<ShopCategory category="jacket" />} />
          <Route path="/girls" element={<ShopCategory category="girls" />} />
          <Route path="/accessories" element={<ShopCategory category="accessories" />} />
          <Route path="/shoes" element={<ShopCategory category="shoes" />} />
          <Route path="/bride" element={<ShopCategory category="bride" />} />
          <Route path="/fashion" element={<ShopCategory category="fashion" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/policy" element={<Policy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
