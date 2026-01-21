// client/src/pages/login.jsx
import { useState } from "react";
import axios from "axios";

const Login = ({ onLogin, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "8px" }}>
            {error}
          </p>
        )}

        <button type="submit">Login</button>
      </form>

      {/* 🔑 THIS WAS MISSING */}
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          style={{ background: "none", color: "#646cff", border: "none", cursor: "pointer" }}
        >
          Create Account
        </button>
      </p>
    </div>
  );
};

export default Login;
