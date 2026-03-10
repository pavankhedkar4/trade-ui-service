import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Configure axios with CORS-friendly settings
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const loginUser = async (username, password) => {
  try {
    console.log("Making login request to:", `${API_BASE_URL}/login/login-user`);

    const response = await axios.post(
      `${API_BASE_URL}/login/login-user`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false, // Don't send cookies
      },
    );

    console.log("Login response:", response.data);

    // Store auth token in localStorage
    const authToken = response.data.authToken || response.data;
    localStorage.setItem("authToken", authToken);

    return authToken;
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error response:", error.response);

    if (error.response?.status === 0) {
      console.error(
        "CORS error detected - check API gateway CORS configuration",
      );
      console.error("Make sure your API gateway allows:");
      console.error("- Origin: http://localhost:5178 (or your Vite port)");
      console.error("- Methods: POST, OPTIONS");
      console.error("- Headers: Content-Type, Accept");
    }

    throw new Error(
      error.response?.data?.message ||
        "Login failed - check CORS configuration",
    );
  }
};

export const signupUser = async (formData) => {
  try {
    console.log("Making signup request to:", `${API_BASE_URL}/login/save-user`);

    const response = await axios.post(
      `${API_BASE_URL}/login/save-user`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false,
      },
    );

    console.log("Signup response:", response.data);

    // Note: Signup returns LoginUser object, not authToken
    // Token will be obtained during login

    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error response:", error.response);

    if (error.response?.status === 0) {
      console.error(
        "CORS error detected - check API gateway CORS configuration",
      );
    }

    throw new Error(error.response?.data?.message || "Signup failed");
  }
};
