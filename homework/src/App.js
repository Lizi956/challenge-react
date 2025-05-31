import React, { useState, useEffect } from "react";

const API_BASE = "https://dummyjson.com/products";

function App() {
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    () => JSON.parse(localStorage.getItem("registeredUsers")) || []
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}?limit=10&skip=${page * 10}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const defaultUser = { email: "random@gmail.com", password: "random123)" };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      if (!email || !password) {
        setError("Email and password required");
        return;
      }
      if (
        registeredUsers.find((u) => u.email === email) ||
        email === defaultUser.email
      ) {
        setError("User already exists");
        return;
      }
      setRegisteredUsers([...registeredUsers, { email, password }]);
      alert("Registration successful! Now please log in.");
      setIsRegistering(false);
      setEmail("");
      setPassword("");
      return;
    }

    if (
      (email === defaultUser.email && password === defaultUser.password) ||
      registeredUsers.find((u) => u.email === email && u.password === password)
    ) {
      setUser({ email });
      setEmail("");
      setPassword("");
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };
  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      alert("Product already in cart");
      return;
    }
    setCart([...cart, product]);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <button type="submit" style={{ width: "100%", padding: 10 }}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p style={{ marginTop: 10 }}>
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            onClick={() => {
              setError("");
              setIsRegistering(!isRegistering);
            }}
            style={{
              color: "blue",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    );
  }

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

export default App;
