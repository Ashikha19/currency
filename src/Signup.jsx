import { useState } from "react";

function Signup({ onSignup, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Account created successfully!");
      onSignup();
    } catch (error) {
      console.error("Signup error:", error);
      alert("Cannot connect to backend. Make sure Django server is running.");
    } finally {
      setLoading(false);
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

      <form className="login-box" onSubmit={handleSignup}>
        <div className="brand-mark">✨</div>
        <h1>Create account</h1>
        <p className="subtitle">Start smarter financial tracking</p>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <button type="button" className="secondary-btn" onClick={onBack}>
          ← Back to Login
        </button>
      </form>
    </div>
  );
}

export default Signup;
