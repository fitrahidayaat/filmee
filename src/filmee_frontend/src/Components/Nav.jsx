import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FiMenu, FiX } from "react-icons/fi";
import { FaChevronDown, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";

export default function Nav(searchTerm, setSearchTerm) {
    return <>
        <nav className="bg-gray-900 p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">FILMEE</h1>

        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="text-large text-red-500">Home</Link>
          <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
        </div>

        <div className="hidden md:flex items-center bg-gray-800 px-4 py-2 rounded-full">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-white outline-none placeholder-gray-400 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-gray-400" />
        </div>

        <div className="hidden md:flex items-center relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <FaUserCircle className="text-white text-2xl" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white mt-30 shadow-lg rounded-lg overflow-hidden z-50">
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
    </>
}