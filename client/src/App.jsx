/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import StackItQAPage from "./Pages/Homepage";
import AskQuestionPage from "./Pages/AskQuestion";
import QuestionDetail from "./Pages/QuestionDetail";
import ProfilePage from "./Pages/ProfilePage";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./Authorisation/ProtectedRoute";
import { AuthProvider } from "./Authorisation/AuthProvider";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/ask-question" element={<AskQuestionPage />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<StackItQAPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
