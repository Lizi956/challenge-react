import React, { useState, useEffect } from "react";

const API_BASE = "https://dummyjson.com/products";

function ProductsPage({ user, setUser }) {
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    fetch(`${API_BASE}?limit=10&skip=${page * 10}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
  };

  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      alert("Product already in cart");
      return;
    }
    setCart([...cart, product]);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Products (Page {page + 1})</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 15,
        }}
      >
        {products.length === 0 && <p>No products found.</p>}
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
            <h4>{product.title}</h4>
            <p style={{ fontWeight: "bold" }}>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={products.length < 10}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Cart ({cart.length})</h3>
        {cart.length === 0 && <p>Your cart is empty.</p>}
        {cart.length > 0 && (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
