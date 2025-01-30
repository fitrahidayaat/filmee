import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Footer from "../Components/Footer";

export default function DashboardPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [isAuthenticated, setIsAuthenticatedState] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    authService.init().then(() => {
      if (!authService.isAuthenticated) {
        setIsAuthenticated(false);
        setIsAuthenticatedState(false);
        localStorage.removeItem("isAuthenticated"); // Hapus session jika tidak valid
        navigate("/login", { replace: true }); // Redirect ke login jika tidak autentikasi
      } else {
        setIsAuthenticatedState(true);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setIsAuthenticatedState(false);
      localStorage.removeItem("isAuthenticated");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return isAuthenticated ? (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">FILMEE</h1>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-large text-red-500">Home</Link>
          <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
        </div>
        <div className="hidden md:flex items-center relative">
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded text-white">
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="mt-20 p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-400">Manage your watchlist, discover new movies, and more!</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  ) : null;
}
