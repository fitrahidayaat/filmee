import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaWallet, FaCrown, FaUserCircle, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import Search from "../Components/ui/Search";
import { useAuth } from "../Hooks/authHook";
import { filmee_backend } from "../../../declarations/filmee_backend";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Untuk mobile menu toggle
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Untuk menu profil dropdown
  const [balance, setBalance] = useState(0); // Contoh saldo
  const plan = "Free"; // Contoh plan user
  const { principal } = useAuth();
  const [imagePreview, setImagePreview] = useState();
  const [user, setUser] = useState();
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [change, setChange] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await filmee_backend.getUserById(principal.toText());
      if (user?.profilePic) {
        // Convert blob (Uint8Array) to data URL
      }
      const blob = new Blob([user[0].profilePic[0]]);
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
      setUser(user[0]);
      setUsername(user[0].username);

      const balance = await filmee_backend.getAccountBalance(principal.toText());
      setBalance(Number(balance));
    }
    fetchUser();
  }, [principal]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setImage(e.currentTarget.result);
      }
      reader.readAsDataURL(file);

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleUpgradePlan = () => {
    navigate('/plan');
  }

  const base64ToBlob = (base64, type = "image/jpeg") => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteNumbers], { type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blob = base64ToBlob(image);
    const nat8Array = new Uint8Array(await blob.arrayBuffer());

    const res = await filmee_backend.updateUserProfile(
      principal.toText(),
      {
        username: [username],  // Keep username as text
        profilePic: nat8Array ? [nat8Array] : []
      }
    );
    console.log(res);
  };

  const handleTopUpClick = () => {
    setShowPopup(true); // Show the popup when the button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  const handleAddFunds = async (amount) => {
    // Logic to add funds
    console.log(amount);
    await filmee_backend.topUpBalance(principal.toText(), amount);
    setBalance(balance + amount);
    setShowPopup(false); // Close the popup after adding funds
  };


  return (
    <>
      <div className="min-h-screen bg-black flex justify-center items-center px-4 montserrat">
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent z-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Funds</h2>
              <input
                type="number"
                placeholder="Enter amount"
                onChange={(e) => setChange(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => handleAddFunds(change)} // Example: Add $100
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl max-w-3xl w-full">
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
                <img src={imagePreview} alt="" className="h-14 w-14 object-cover rounded-full cursor-pointer" />
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
          <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
            <div className="relative group">
              <label htmlFor="upload-photo" className="cursor-pointer">
                {imagePreview ? (
                  <img
                    src={imagePreview}
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
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Username Input */}
            <div className="w-full text-center">
              <input
                type="text"
                name="username"
                className="bg-gray-800 text-white text-center p-2 w-60 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button className="bg-red-600 px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all">
              Save Changes
            </button>
          </form>

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
              <button className="mt-4 w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-all" onClick={handleTopUpClick}>
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
              <button className="mt-4 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700 transition-all" onClick={handleUpgradePlan}>
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
