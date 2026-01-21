// client/src/pages/register.jsx
import { useState } from "react";
import axios from "axios";

const Register = ({ onRegister, switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      // registration success → go back to login
      onRegister();
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button type="submit">Register</button>
      </form>

      {/* 🔁 THIS WAS MISSING */}
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          style={{
            background: "none",
            color: "#646cff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
