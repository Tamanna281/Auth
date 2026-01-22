// client/src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import FormBuilder from "./pages/FormBuilder";
import FormEditor from "./pages/FormEditor";
import FormSubmissions from "./pages/FormSubmissions";
import FormFill from "./pages/FormFill";
import EditSubmission from "./pages/EditSubmission";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return <p style={{ textAlign: "center" }}>Checking authentication...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated users */}
        {!isAuthenticated && (
          <Route
            path="/"
            element={
              isLogin ? (
                <Login
                  onLogin={() => setIsAuthenticated(true)}
                  switchToRegister={() => setIsLogin(false)}
                />
              ) : (
                <Register
                  onRegister={() => setIsLogin(true)}
                  switchToLogin={() => setIsLogin(true)}
                />
              )
            }
          />
        )}

        {/* Authenticated users */}
        {isAuthenticated && (
          <>
            <Route path="/" element={<FormBuilder />} />

            {/* EDIT FORM SCHEMA */}
            <Route path="/forms/:id/edit" element={<FormEditor />} />

            {/* VIEW SUBMISSIONS */}
            <Route
              path="/forms/:id/submissions"
              element={<FormSubmissions />}
            />

            <Route
              path="/submissions/:submissionId/edit"
              element={<EditSubmission />}
            />

            <Route
              path="/forms/:id/fill"
              element={<FormFill />}
            />


          </>
        )}

        {/* Catch-all MUST be last */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
