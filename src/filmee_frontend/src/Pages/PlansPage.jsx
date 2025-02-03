import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";
import Search from "../Components/ui/Search";
import { useAuth } from "../Hooks/authHook";
import { filmee_backend } from "../../../declarations/filmee_backend";

export default function PlansPage() {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const {principal, logout} = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await filmee_backend.getUserById(principal.toText());
      if (user?.profilePic) {
        // Convert blob (Uint8Array) to data URL
      }
      const blob = new Blob([user[0].profilePic[0]]);
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    }
    fetchUser();
  }, [principal]);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleTier1 = async () => {
    const res = await filmee_backend.purchasePremium(principal.toText(), "tier1");
    navigate("/profile");
  };

  const handleTier2 = async () => {
    const res = await filmee_backend.purchasePremium(principal.toText(), "tier2");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between montserrat">
      {/* Navbar */}
      <nav className="bg-transparent p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 px-10 md:px-20 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">FILMEE</h1>

        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="text-large hover:text-gray-400">Home</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
        </div>

        <div className="hidden md:flex items-center bg-gray-800 px-4 py-2 rounded-full">
          <Search />
        </div>

        <div className="hidden md:flex items-center relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            {/* <FaUserCircle className="text-white text-3xl" /> */}
            <img src={imagePreview}  alt="" className="h-14 w-14 object-cover rounded-full cursor-pointer" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white mt-30 shadow-lg rounded-lg overflow-hidden z-50">
              <button onClick={handleProfile} className="flex items-center px-4 py-2 hover:bg-gray-700 w-full text-left">
                <FaUser className="mr-2" /> Profile
              </button>
              <button onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-gray-700 w-full text-left">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

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
              <button className="bg-black text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-gray-800 transition" onClick={handleTier1}>
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
              <button className="bg-black text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-gray-800 transition" onClick={handleTier2}>
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
