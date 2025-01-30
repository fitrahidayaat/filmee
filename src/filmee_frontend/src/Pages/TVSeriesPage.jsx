import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaChevronDown, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";

const tvseries = [
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
  { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
  { title: "Silent Hill 2", description: "A man searches for his missing wife in Silent Hill.", image: "/s-l1200.jpg", genre: "Horror" },
];

const genres = ["All", "Horror", "Action", "Comedy", "Drama"];

export default function TvSeriesPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tvseries.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTvSeries = tvseries.filter(tvserie => 
    (selectedGenre === "All" || tvserie.genre === selectedGenre) && 
    tvserie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between">
          {/* Navbar */}
          <nav className="bg-gray-900 p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 shadow-md">
            <h1 className="text-2xl font-bold tracking-wide">FILMEE</h1>
            <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-large hover:text-gray-400">Home</Link>
                        <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
                        <Link to="/tv-series" className="text-large text-red-500">TV Series</Link>
                        <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
            </div>
            <div className="hidden md:flex items-center bg-gray-800 px-4 py-2 rounded-full">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent text-white outline-none placeholder-gray-400" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="text-gray-400" />
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </nav>
          
          {/* Mobile Menu */}
          {menuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 flex flex-col space-y-4 shadow-md">
              <Link to="/" className="text-large hover:text-gray-400">Home</Link>
                        <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
                        <Link to="/tv-series" className="text-large text-red-500">TV Series</Link>
                        <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent text-white outline-none w-full placeholder-gray-400" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="text-gray-400" />
              </div>
            </motion.div>
          )}
      
      {/* Content Wrapper */}
      <div className="flex-grow mt-20">
        {/* Genre Dropdown */}
        <div className="flex justify-center my-6">
          <select className="bg-gray-800 text-white px-4 py-2 rounded focus:ring focus:ring-gray-700" onChange={(e) => setSelectedGenre(e.target.value)}>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        {/* TV Series List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {filteredTvSeries.map((tvseries, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
              <img src={tvseries.image} alt={tvseries.title} className="w-full h-60 object-cover rounded-lg" />
              <div className="mt-4">
                <span className="bg-gray-700 px-2 py-1 text-xs rounded font-medium">{tvseries.genre}</span>
                <h4 className="text-lg font-semibold mt-2 leading-tight">{tvseries.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{tvseries.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
}