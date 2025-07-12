import { Link } from "react-router-dom";
import { useAuth } from "../../Authorisation/AuthProvider";
import NotificationBell from "../NotificationBell";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-4 relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu}>
          <div className="text-xl md:text-2xl font-bold">StackIt</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
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
                <span>{user?.name}</span>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {isAuthenticated && <NotificationBell />}
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-blue-600 border-t border-blue-500 z-50">
          <div className="px-4 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/ask-question"
                  onClick={closeMobileMenu}
                  className="block bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Ask Question
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="block bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors text-center"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors"
                >
                  <img
                    src={
                      user?.profilePicture ||
                      "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <span className="text-lg">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
