/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

import HeroPage from "./Pages/HeroPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import LocateUser from "./Pages/Location";
import ContactUs from "./Pages/ContactUs";
import ProfilePage from "./Pages/Profile";
import Attendance from "./Pages/Attendece";
import About from "./Pages/About";
import ProtectedRoute from "./Authorisation/ProtectedRoute";
import { AuthProvider } from "./Authorisation/AuthProvider";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/Attendence"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HeroPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/location"
              element={
                <ProtectedRoute>
                  <LocateUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
