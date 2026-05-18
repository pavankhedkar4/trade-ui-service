import "./Homepage.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  loginUser,
  validateClient,
  getAccessCode,
} from "../services/authService";

function Homepage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("info");

  const handleRefresh = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setFeedbackType("error");
        setFeedbackMessage("Missing auth token. Please login again.");
        return;
      }

      const accessCode = await getAccessCode(authToken);
      if (!accessCode) {
        setFeedbackType("info");
        setFeedbackMessage(
          "Kindly complete the upstock account validation and click on refresh",
        );
        return;
      }

      navigate("/upstock-homepage");
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(
        error?.message || "Unable to verify upstock validation",
      );
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Attempting login from homepage with:", username, password);
      const authToken = await loginUser(username, password);

      //alert("Login Success");
      console.log("Auth Token received:", authToken);
      console.log(
        "Token stored in localStorage:",
        localStorage.getItem("authToken"),
      );

      // Validate the client and get the redirection URL from validation API
      const redirectUrl = await validateClient(authToken);

      // Try fetching the redirect URL to detect API payload error before actual redirect
      try {
        const response = await axios.get(redirectUrl, {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: false,
        });

        if (
          response.data?.status === "error" ||
          response.data?.status === "ERROR"
        ) {
          const errMsg =
            response.data?.errors?.[0]?.message ||
            response.data?.errors?.[0]?.errorCode ||
            "Redirect target returned an error";
          setFeedbackType("error");
          setFeedbackMessage(errMsg);
          return;
        }

        if (response.status >= 400) {
          setFeedbackType("error");
          setFeedbackMessage(
            `Redirect target returned HTTP ${response.status}.`,
          );
          return;
        }
      } catch (preCheckError) {
        console.warn("Redirect URL pre-check failed:", preCheckError);

        const data = preCheckError.response?.data;
        if (data?.status === "error" || data?.status === "ERROR") {
          const errMsg =
            data?.errors?.[0]?.message ||
            data?.errors?.[0]?.errorCode ||
            "Redirect target returned an error";
          setFeedbackType("error");
          setFeedbackMessage(errMsg);
          return;
        }

        // Not enough info to show specific error; continue redirect anyway.
        setFeedbackType("info");
        setFeedbackMessage(
          "Could not verify redirect destination due network/CORS; redirecting.",
        );
      }

      setFeedbackType("success");
      setFeedbackMessage(
        "Please complete the upstock validation and click on below button",
      );

      console.log("Opening redirect URL in new tab:", redirectUrl);
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Homepage login failed:", error);
      setFeedbackType("error");
      setFeedbackMessage(error?.message || "Login failed");
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

            {feedbackMessage && (
              <div className={`login-feedback ${feedbackType}`}>
                {feedbackMessage}
                {feedbackType === "success" && (
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="refresh-btn"
                  >
                    Refresh
                  </button>
                )}
              </div>
            )}

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
