import { useState } from "react";
import axios from "axios";
import "./UpstockUser.css";

function UpstockUser() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateMobile = async () => {
    if (!mobile.trim()) {
      setMessage("Please enter a mobile number");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setMessage("Authentication required. Please login again.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:8081/validate-user",
        {
          mobile: mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setMessage("Mobile number validated successfully!");
      setIsValidated(true);
    } catch (error) {
      console.error("Validation error:", error);
      setMessage("Mobile validation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter OTP");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    setIsLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:8080/api/send-otp",
        {
          mobile: mobile,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setMessage("OTP verified successfully!");
    } catch (error) {
      console.error("OTP error:", error);
      setMessage("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upstock-container">
      <div className="upstock-card">
        <h2 className="upstock-title">Upstock Account Vefication</h2>
        <p className="upstock-subtitle">
          Enter the mobile number to verify your upstock account
        </p>

        <div className="step-indicator">
          <div className={`step ${!isValidated ? "active" : "completed"}`}>
            1
          </div>
          <div className="step-line active"></div>
          <div className={`step ${isValidated ? "active" : ""}`}>2</div>
        </div>

        <div className="input-group">
          <input
            type="tel"
            className="mobile-input"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={isValidated || isLoading}
            maxLength="10"
          />

          {isValidated && (
            <input
              type="text"
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
              maxLength="6"
            />
          )}
        </div>

        <div className="button-group">
          {!isValidated ? (
            <button
              className="validate-btn"
              onClick={validateMobile}
              disabled={isLoading}
            >
              {isLoading ? "Validating..." : "Validate Mobile"}
            </button>
          ) : (
            <button className="otp-btn" onClick={sendOtp} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          )}
        </div>

        {message && (
          <div
            className={`status-message ${message.includes("success") ? "success-message" : "error-message"}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpstockUser;
