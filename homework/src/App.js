import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList";
import CartPage from "./pages/CartPage";

function App() {
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("isRegistered") === "true";
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("isRegistered", isRegistered);
  }, [isRegistered]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isRegistered ? (
              <Navigate to="/products" />
            ) : (
              <LoginPage onRegister={handleRegister} />
            )
          }
        />
        <Route
          path="/products"
          element={
            isRegistered ? (
              <ProductList addToCart={addToCart} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isRegistered ? <CartPage cart={cart} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
