import { Link } from "react-router-dom";
import { useAuth } from "../../Authorisation/AuthProvider";
import NotificationBell from "../NotificationBell";

const Navbar = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();

  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-4">
      <a href="/">
        <div className="text-2xl font-bold">StackIt</div>
      </a>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <NotificationBell />
            <Link
              to="/ask-question"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ask Question
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Admin</span>
              </Link>
            )}
            <Link
              to="/profile"
              className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              <img
                src={
                  user?.profilePicture ||
                  "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                }
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span className="hidden md:block">{user?.name}</span>
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
