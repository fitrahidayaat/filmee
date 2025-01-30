import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";

export default function PlansPage() {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("isAuthenticated");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">FILMEE</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
        <Link to="/" className="text-large hover:text-gray-400">Home</Link>
          <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
          <Link to="/plans" className="text-large text-red-500">Plans</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 flex flex-col space-y-4 shadow-md z-50">
          <Link to="/" className="text-large hover:text-gray-400">Home</Link>
          <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
          <Link to="/plans" className="text-large red-text-500">Plans</Link>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow mt-20 flex flex-col items-center px-4 md:px-10 lg:px-20 py-16">
        <h1 className="text-4xl font-extrabold text-center">Choose Your Plan!</h1>
        <p className="text-gray-400 text-lg text-center mt-4 max-w-2xl">
          Find the subscription that fits your needs and enjoy a seamless viewing experience.
        </p>

        {/* Plans Container */}
        <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center items-center w-full">
          {/* Free Plan */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-gray-600 mt-2">• Movie recommendations</p>
            <button className="bg-gray-300 text-gray-500 font-semibold py-2 px-6 rounded-lg w-full mt-4 cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Tier 1 Plan */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h2 className="text-2xl font-bold">Tier 1</h2>
            <p className="text-3xl font-extrabold">ICP <span className="text-4xl">5</span>/mo</p>
            <p className="text-gray-600 mt-2">• Movie recommendations</p>
            <p className="text-gray-600">• Advanced search & filter</p>
            <Link to="/register">
              <button className="bg-black text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-gray-800 transition">
                Purchase
              </button>
            </Link>
          </div>

          {/* Tier 2 Plan */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h2 className="text-2xl font-bold">Tier 2</h2>
            <p className="text-3xl font-extrabold">ICP <span className="text-4xl">10</span>/mo</p>
            <p className="text-gray-600 mt-2">• Movie recommendations</p>
            <p className="text-gray-600">• Advanced search & filter</p>
            <p className="text-gray-600">• Movie bookmarking</p>
            <p className="text-gray-600">• Spoiler detection</p>
            <Link to="/register">
              <button className="bg-black text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-gray-800 transition">
                Purchase
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
