import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { auth } from "./utils/firebase";
import LoadingSpinner from "./components/Loading";

const AppProvider = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => {
    auth.signOut();
    chrome.runtime.sendMessage({ action: "logout" });
  };
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex justify-around bg-primary-dark p-4 text-sm font-medium">
        <Link
          to="/"
          className={
            isActive("/")
              ? "text-white font-bold"
              : "text-gray-300 hover:text-white"
          }
        >
          Feed
        </Link>
        <Link
          to="/popular"
          className={
            isActive("/popular")
              ? "text-white font-bold"
              : "text-gray-300 hover:text-white"
          }
        >
          Popular
        </Link>
        <Link
          to="/phrase"
          className={
            isActive("/phrase")
              ? "text-white font-bold"
              : "text-gray-300 hover:text-white"
          }
        >
          Phrases
        </Link>
        <button
          className="text-gray-300 rounded hover:text-white transition-colors duration-300"
          onClick={handleLogout}
        >
          {/* Logout icon as SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M9 12h12m0 0l-3-3m3 3l-3 3"
            />
          </svg>
        </button>
      </nav>
      <Outlet />
    </div>
  );
};

export default AppProvider;
