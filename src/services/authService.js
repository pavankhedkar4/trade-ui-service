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

export const validateClient = async (authToken) => {
  const extractUrl = (data) => {
    if (!data) return null;

    if (typeof data === "string") {
      return data.trim();
    }

    const keysToCheck = [
      "redirectUrl",
      "redirect",
      "url",
      "nextUrl",
      "next",
      "link",
      "redirect_uri",
    ];

    for (const key of keysToCheck) {
      if (typeof data[key] === "string" && data[key].trim()) {
        return data[key].trim();
      }
    }

    // Some APIs wrap payload inside `data`.
    if (typeof data.data === "object") {
      return extractUrl(data.data);
    }

    return null;
  };

  try {
    console.log("Validating client for upstock");

    const response = await axios.get(
      `${API_BASE_URL}/client/validate?clientCode=upstock`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: false,
      },
    );

    console.log("Client validation response:", response.data);

    if (
      response.data?.status === "error" ||
      response.data?.status === "ERROR"
    ) {
      const errors = response.data?.errors || [];
      const errorMessages = errors
        .map((err) => err?.message || err?.errorCode || JSON.stringify(err))
        .filter(Boolean);
      throw new Error(
        errorMessages.length > 0
          ? errorMessages.join(" - ")
          : "Client validation failed with an error.",
      );
    }

    const redirectUrl = extractUrl(response.data);
    if (!redirectUrl) {
      throw new Error(
        "Client validation succeeded but did not return a redirect URL",
      );
    }

    return redirectUrl;
  } catch (error) {
    console.error("Client validation error:", error);
    console.error("Error response:", error.response);

    if (!error.response) {
      throw new Error("Client validation unavailable");
    }

    throw new Error(
      error.response?.data?.message || "Client validation failed",
    );
  }
};

const extractAccessCode = (data) => {
  if (!data) return null;
  if (typeof data === "string") return data.trim() || null;
  if (typeof data === "object") {
    if (typeof data.code === "string" && data.code.trim())
      return data.code.trim();
    if (typeof data.accessCode === "string" && data.accessCode.trim())
      return data.accessCode.trim();
    if (typeof data.data === "object") return extractAccessCode(data.data);
  }
  return null;
};

export const getAccessCode = async (authToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/login/getAccessCode`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: false,
    });

    console.log("Access code response:", response.data);

    return extractAccessCode(response.data);
  } catch (error) {
    console.error("Get access code error:", error);
    console.error("Error response:", error.response);

    if (!error.response) {
      throw new Error("Unable to verify access code");
    }

    throw new Error(
      error.response?.data?.message || "Unable to verify access code",
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
