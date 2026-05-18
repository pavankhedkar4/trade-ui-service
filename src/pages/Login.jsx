import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  loginUser,
  validateClient,
  getAccessCode,
} from "../services/authService";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(() => {
    // Initialize username from URL params
    const usernameParam = searchParams.get("username");
    return usernameParam ? decodeURIComponent(usernameParam) : "";
  });
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
      console.log("Attempting login with:", username, password);
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
      console.error("Login failed:", error);
      setFeedbackType("error");
      setFeedbackMessage(error?.message || "Login failed");
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
