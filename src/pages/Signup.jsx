import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    upstockId: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      const response = await signupUser(formData);

      // Navigate to login page with username pre-populated
      navigate(
        `/login?username=${encodeURIComponent(response.username || formData.username)}`,
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join our trading platform today</p>
        </div>

        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="input-group">
            <input
              name="name"
              className="signup-input"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              name="emailId"
              type="email"
              className="signup-input"
              placeholder="Email ID"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              name="upstockId"
              className="signup-input"
              placeholder="Upstock ID"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              name="username"
              className="signup-input"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              className="signup-input"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
