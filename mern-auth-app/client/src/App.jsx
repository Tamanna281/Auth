import { useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import FormBuilder from "./pages/FormBuilder";


function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <FormBuilder />
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      {isLogin ? (
        <Login onLogin={handleLoginSuccess} />
      ) : (
        <Register onRegister={() => setIsLogin(true)} />
      )}

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <button onClick={() => setIsLogin(false)}>Create Account</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </>
        )}
      </p>
    </>
  );
}

export default App;
