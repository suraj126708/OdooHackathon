/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Navigate, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import PieChart from "../components/PieChart";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../Authorisation/AuthProvider";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const { logout } = useContext(AuthContext);

  const shifts = [
    {
      day: "Monday",
      shift: "Morning",
      present: 50,
      absent: 10,
    },
    {
      day: "Tuesday",
      shift: "Evening",
      present: 45,
      absent: 15,
    },
    {
      day: "wednesday",
      shift: "Night",
      present: 55,
      absent: 5,
    },
  ];

  function handleLogout() {
    handleSuccess("logged out successfully ");
    logout();
    navigate("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(
            "https://coal-mines-backend.onrender.com/userinfo",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            handleError("Failed to fetch user details");
          }

          const data = await response.json();
          setUserDetails(data.user);
        } catch (error) {
          handleError(error);
        }
      };

      fetchUserDetails();
    }
  }, [navigate]);


const profilepicRaw = localStorage.getItem("profilePicture");
const fileName = profilepicRaw ? profilepicRaw.split("/").pop() : null;

const profilepic = fileName
  ? `https://coal-mines-backend.onrender.com/uploads/${fileName}`
  : "https://flowbite.com/docs/images/people/profile-picture-3.jpg";
  
  if (!userDetails)
    return (
      <div className="h-[100vh] w-[100%] flex justify-center items-center text-center font-serif font-semibold text-2xl">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <>
      <NavBar id="black" />
      <div className="min-h-screen mt-24 flex bg-transparent p-6">
        <div className="w-1/4 bg-slate-300 bg-opacity-80 shadow-md rounded-lg p-4 flex flex-col items-center">
          <img
            src={
              profilepic ||
              "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=189&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            }
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">
            {userDetails.user.name}
          </h2>
          <p className="text-gray-500">Coal Mine Worker</p>
          <div className="mt-9 text-gray-700 space-y-3">
            <p>
              <span className="font-bold">Name:</span> {userDetails.user.name}
            </p>
            <p>
              <span className="font-bold">Mobile No:</span>{" "}
              {userDetails.user.contact}
            </p>
            <p>
              <span className="font-bold">Gender:</span>{" "}
              {userDetails.user.gender}
            </p>
            <p>
              <span className="font-bold">Shift:</span> Morning
            </p>
            <p>
              <span className="font-bold">Join Date: </span>
              {userDetails.user.date.slice(0, 10)}
            </p>
            <p>
              <span className="font-bold">Job Role:</span>{" "}
              {userDetails.user.name == "suraj Gitte"
                ? "constructor"
                : "Worker"}
            </p>
          </div>
          <button
            className="mt-10 bg-red-500 px-5 py-3 rounded-md text-white hover:bg-red-600 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Right Section */}
        <div className="w-3/4 ml-6">
          {/* Upper Part */}
          <div className="bg-slate-300 bg-opacity-80  shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Shift Details</h2>
            <ul className="list-none space-y-4 text-gray-700 mt-4">
              {shifts.map((shift, index) => (
                <li
                  key={index}
                  className="bg-slate-100 p-4 rounded-md shadow-sm flex justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {shift.day} - {shift.shift}
                    </h4>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600">
                      Present: {shift.present}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600">
                      Absent: {shift.absent}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* PieChart Section */}
          <div className="bg-slate-300 bg-opacity-80 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Attendance Overview
            </h3>
            <PieChart present={shifts[0].present} absent={shifts[0].absent} />
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProfilePage;
