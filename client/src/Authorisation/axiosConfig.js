import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://odoohackathon-h2x5.onrender.com",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request Config:", config);
    console.log("Request URL:", config.url);
    console.log("Request Method:", config.method);
    console.log("Request Headers:", config.headers);

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For multipart/form-data requests, don't set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    console.error("Response Error Config:", error.config);
    console.error("Response Error Status:", error.response?.status);
    console.error("Response Error Data:", error.response?.data);

    // Handle network errors
    if (!error.response) {
      console.error("Network Error - No response received");
      return Promise.reject({
        message: "Network error. Please check your connection and try again.",
        isNetworkError: true,
      });
    }

    // Handle CORS errors specifically
    if (error.response.status === 0 || error.code === "ERR_NETWORK") {
      console.error("CORS Error detected");
      return Promise.reject({
        message:
          "CORS error. Please check if the server is running and accessible.",
        isCorsError: true,
      });
    }

    // Handle 401 unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Don't redirect automatically, let the component handle it
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
