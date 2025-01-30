import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";
  
export default function DashboardPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const carouselRef = useRef(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const movies = [
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
    { title: "Silent Hill 2: Where The Shadow Returns", description: "A supernatural horror journey into a fog-covered town filled with dark secrets.", image: "/s-l1200.jpg", genre: "Horror" },
    { title: "Spider-Man: Across The Spider-Verse", description: "Miles Morales explores the multiverse.", image: "/Spider-Man-Across-the-Spider-Verse-Poster.jpg", genre: "Action" },
    { title: "Silent Hill (2006)", description: "A horror mystery set in a fog-covered town.", image: "/SpiderManFarFromHomeTheatrical.jpg", genre: "Horror" },
  ];

  useEffect(() => {
    authService.init().then(() => {
      if (!authService.isAuthenticated) {
        setIsAuthenticated(false);
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
      localStorage.removeItem("isAuthenticated");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
        <div className="hidden md:flex items-center relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <FaUserCircle className="text-white text-2xl" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 mt-30 text-white shadow-lg rounded-lg overflow-hidden z-50">
              <Link to="/edit-profile" className="block px-4 py-2 hover:bg-gray-700">Edit Profile</Link>
              <button onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-gray-700 w-full text-left">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 flex flex-col space-y-4 shadow-md z-50">
          <Link to="/" className="text-large text-red-500">Home</Link>
                                  <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
                                  <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
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
          <div className="flex flex-col items-start bg-gray-800 p-4 rounded-lg">
            <Link to="/edit-profile" className="hover:text-gray-400 mb-2">Edit Profile</Link>
            <button onClick={handleLogout} className="flex items-center text-white hover:text-gray-400">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center flex items-center text-left px-10 md:px-20" style={{ backgroundImage: "url('/bg-1.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{movies[currentSlide].title}</h1>
          <p className="text-lg md:text-xl mb-6">{movies[currentSlide].description}</p>
          <button className="bg-red-600 px-6 py-3 text-lg font-semibold rounded-full hover:bg-red-700 transition-all">Learn More</button>
        </div>
      </section>

      {/* Movie Carousel */}
      <div className="relative mt-20 p-6">
        <h2 className="text-2xl font-semibold mb-4">You Might Like</h2>
        <div className="relative flex items-center">
          <button className="absolute left-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollLeft}>
            <FaChevronLeft size={24} />
          </button>
          <div ref={carouselRef} className="overflow-x-auto flex space-x-4 scrollbar-hide no-scrollbar w-full px-12 no-scrollbar">
            {movies.map((movie, index) => (
              <div key={index} className="min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded-lg" />
                <h4 className="text-lg font-semibold mt-2">{movie.title}</h4>
                <p className="text-xs text-gray-300">{movie.description}</p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollRight}>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
      {/* Movie Carousel */}
      <div className="relative mt-20 p-6">
        <h2 className="text-2xl font-semibold mb-4">Horror Collection</h2>
        <div className="relative flex items-center">
          <button className="absolute left-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollLeft}>
            <FaChevronLeft size={24} />
          </button>
          <div ref={carouselRef} className="overflow-x-auto flex space-x-4 scrollbar-hide no-scrollbar w-full px-12 no-scrollbar">
            {movies.map((movie, index) => (
              <div key={index} className="min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded-lg" />
                <h4 className="text-lg font-semibold mt-2">{movie.title}</h4>
                <p className="text-xs text-gray-300">{movie.description}</p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollRight}>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
      {/* Movie Carousel */}
      <div className="relative mt-20 p-6">
        <h2 className="text-2xl font-semibold mb-4">In Action</h2>
        <div className="relative flex items-center">
          <button className="absolute left-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollLeft}>
            <FaChevronLeft size={24} />
          </button>
          <div ref={carouselRef} className="overflow-x-auto flex space-x-4 scrollbar-hide no-scrollbar w-full px-12 no-scrollbar">
            {movies.map((movie, index) => (
              <div key={index} className="min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded-lg" />
                <h4 className="text-lg font-semibold mt-2">{movie.title}</h4>
                <p className="text-xs text-gray-300">{movie.description}</p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollRight}>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
      {/* Movie Carousel */}
      <div className="relative mt-20 p-6">
        <h2 className="text-2xl font-semibold mb-4">Comedy</h2>
        <div className="relative flex items-center">
          <button className="absolute left-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollLeft}>
            <FaChevronLeft size={24} />
          </button>
          <div ref={carouselRef} className="overflow-x-auto flex space-x-4 scrollbar-hide no-scrollbar w-full px-12 no-scrollbar">
            {movies.map((movie, index) => (
              <div key={index} className="min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded-lg" />
                <h4 className="text-lg font-semibold mt-2">{movie.title}</h4>
                <p className="text-xs text-gray-300">{movie.description}</p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollRight}>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  ) : null;
}
