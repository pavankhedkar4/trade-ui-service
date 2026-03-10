import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login() {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(() => {
    // Initialize username from URL params
    const usernameParam = searchParams.get("username");
    return usernameParam ? decodeURIComponent(usernameParam) : "";
  });
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Attempting login with:", username, password);
      const authToken = await loginUser(username, password);

      alert("Login Successful");
      console.log("Auth Token received:", authToken);
      console.log(
        "Token stored in localStorage:",
        localStorage.getItem("authToken"),
      );

      // Redirect to mobile verification
      console.log("Redirecting to /upstock-user");
      window.location.href = "/upstock-user";
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your trading account</p>
        </div>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
