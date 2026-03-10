import "./Homepage.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

function Homepage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Attempting login from homepage with:", username, password);
      const authToken = await loginUser(username, password);

      alert("Login Success");
      console.log("Auth Token received:", authToken);
      console.log(
        "Token stored in localStorage:",
        localStorage.getItem("authToken"),
      );

      // Redirect to mobile verification
      console.log("Redirecting to /upstock-user");
      window.location.href = "/upstock-user";
    } catch (error) {
      console.error("Homepage login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  };
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyApp</div>

        <ul className="nav-links">
          <li>Products</li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li className="signup">
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="content">
        {/* Left Section */}
        <div className="description">
          <h1>Welcome to My Application</h1>

          <p>
            This platform helps organizations manage products, users and
            operations efficiently using modern technology.
          </p>

          <p>
            Built with React frontend and Java backend, the application provides
            secure authentication, scalable architecture and high performance.
          </p>
        </div>

        {/* Right Section */}
        <div className="login-section">
          <div className="login-box">
            <h2>Login</h2>

            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <br />
            <br />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
