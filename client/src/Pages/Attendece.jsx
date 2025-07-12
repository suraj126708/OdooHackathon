/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import axios from "axios";

const Attendance = () => {
  const [presence, setPresence] = useState("");
  const [problem, setProblem] = useState("");
  const [additionalProblem, setAdditionalProblem] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [inCoalMines, setInCoalMines] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const coalMinesBoundary = {
    latMin: 18.456654208078284,
    latMax: 19.468963839157322,
    lngMin: 73.86028593486971,
    lngMax: 74.87132200010046,
  };

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          if (
            latitude >= coalMinesBoundary.latMin &&
            latitude <= coalMinesBoundary.latMax &&
            longitude >= coalMinesBoundary.lngMin &&
            longitude <= coalMinesBoundary.lngMax
          ) {
            setPresence("Present");
            setInCoalMines(true);
          } else {
            setPresence("Absent");
            setInCoalMines(false);
            alert("You are outside the coal mines location. Marked as Absent.");
          }
        },
        (error) => {
          console.error("Error getting location", error);
          setPresence("Absent");
        }
      );
    };

    getLocation();
  }, []);

  const handleProblemChange = (e) => {
    setProblem(e.target.value);
  };

  const handleAdditionalProblemChange = (e) => {
    setAdditionalProblem(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://coal-mines-backend.onrender.com/attendance/mark",
        {
          presence,
          problem,
          additionalProblem,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setShowPopup(true); // Show popup on successful attendance marking
    } catch (err) {
      console.error(err);
      const errorMessage = err.response
        ? err.response.data.error
        : "Error submitting data";
      setError(errorMessage);

      // Specific handling for already marked attendance
      if (errorMessage === "Attendance already marked for today") {
        setMessage("Your attendance is already marked for today.");
        setShowPopup(true); // Show popup for already marked attendance
      } else {
        setMessage(errorMessage); // Handle other errors
        setShowPopup(true);
      }
    }
  };

  const handleBackToHome = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <>
      <NavBar id="black" />
      <div className="mt-24 flex bg-transparent p-6">
        <div className="w-full max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add Your Shift Presence
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Your location is{" "}
            {location.lat && location.lng
              ? `(${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
              : "loading..."}
          </p>

          {inCoalMines ? (
            <p className="text-green-600 font-semibold mb-6">
              You are within the coal mines location. Marked as Present.
            </p>
          ) : (
            <p className="text-red-600 font-semibold mb-6">
              You are outside the coal mines location. Marked as Absent.
            </p>
          )}

          {/* Display Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Problem Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Did you face any problems during your shift?
              </label>
              <select
                value={problem}
                onChange={handleProblemChange}
                className="w-full px-4 py-2 border bg-slate-100 border-gray-300 rounded-lg"
              >
                <option value="" disabled>
                  Select a problem (if any)
                </option>
                <option value="None">No problems</option>
                <option value="Equipment Issue">Equipment Issue</option>
                <option value="Health Concern">Health Concern</option>
                <option value="Overwork">Overwork</option>
                <option value="Work Environment">Work Environment</option>
              </select>
            </div>

            {/* Additional Problem Textarea */}
            {problem !== "None" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Problem (Optional)
                </label>
                <textarea
                  value={additionalProblem}
                  onChange={handleAdditionalProblemChange}
                  placeholder="Describe the problem"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              {message.includes("already marked")
                ? "Attendance Status"
                : "Attendance Recorded!"}
            </h2>
            <p className="mb-6 text-gray-700">{message}</p>
            <button
              onClick={handleBackToHome}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Attendance;
