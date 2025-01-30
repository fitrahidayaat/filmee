import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaWallet, FaCrown, FaUserCircle } from "react-icons/fa";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Untuk mobile menu toggle
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Untuk menu profil dropdown
  const balance = 20; // Contoh saldo
  const plan = "Free"; // Contoh plan user


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };


  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl max-w-3xl w-full">
      {/* Navbar */}
      <nav className="bg-gray-900 p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">FILMEE</h1>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-large text-red-500">
            Home
          </Link>
          <Link to="/movies" className="text-large hover:text-gray-400">
            Movies
          </Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">
            TV Series
          </Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">
            Your Watchlist
          </Link>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 flex flex-col space-y-4 shadow-md z-50">
          <Link to="/" className="text-large text-red-500">
            Home
          </Link>
          <Link to="/movies" className="text-large hover:text-gray-400">
            Movies
          </Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">
            TV Series
          </Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">
            Your Watchlist
          </Link>
        </div>
      )}
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <label htmlFor="upload-photo" className="cursor-pointer">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                />
              ) : (
                <FaUserCircle className="text-gray-500 w-28 h-28" />
              )}
              <div className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <FaEdit className="text-white" />
              </div>
            </label>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Username Input */}
          <div className="w-full text-center">
            <input
              type="text"
              className="bg-gray-800 text-white text-center p-2 w-60 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button className="bg-red-600 px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all">
            Save Changes
          </button>
        </div>

        {/* Wallet & Plan Section */}
        <div className="flex justify-between mt-6 space-x-4">
          {/* Wallet Card */}
          <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-3">
              <FaWallet className="text-yellow-400 text-3xl" />
              <h3 className="text-lg font-semibold">Wallet</h3>
            </div>
            <p className="text-gray-400 mt-2">Balance</p>
            <p className="text-xl font-bold">{balance} ICP</p>
            <button className="mt-4 w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-all">
              {balance === 0 ? "Top Up" : "Add Funds"}
            </button>
          </div>

          {/* Plan Card */}
          <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
            <div className="flex items-center space-x-3">
              <FaCrown className="text-yellow-500 text-3xl" />
              <h3 className="text-lg font-semibold">Plan</h3>
            </div>
            <p className="text-gray-400 mt-2">Your Current Plan</p>
            <p className="text-xl font-bold">{plan}</p>
            <button className="mt-4 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700 transition-all">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
