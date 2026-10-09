import { useState } from "react";

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const user = {
        id: data.id,
        email: data.email,
        username: data.email?.split("@")[0] || "User",
      };

      // Start React session
      sessionStorage.setItem("currentUser", JSON.stringify(user));

      onLogin(user);
    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-currency-scene" aria-hidden="true">
        <span className="currency-symbol coin-rupee">₹</span>
        <span className="currency-symbol coin-bitcoin">₿</span>
        <span className="currency-symbol coin-eth">Ξ</span>
        <span className="currency-symbol coin-dollar">$</span>
        <span className="currency-symbol coin-yen">¥</span>
        <span className="currency-symbol coin-euro">€</span>
      </div>

      <div className="login-card">
        <div className="brand-mark">💰</div>
        <h2>Welcome back</h2>
        <p className="subtitle">Track your money with confidence</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="auth-switch">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-button"
            onClick={onSignup}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;