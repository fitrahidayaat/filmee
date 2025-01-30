import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaHeart, FaRegHeart, FaPaperPlane } from "react-icons/fa";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer";
import moment from "moment";

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
];

export default function ReviewFilmPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const authService = new AuthService();
  const carouselRef = useRef(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
  
    const handleAddReview = () => {
      if (reviewText.trim() === "") return;
  
      const newReview = {
        id: Date.now(),
        username: "Samsul", // Static user for now
        text: reviewText,
        date: moment().format("YYYY-MM-DD HH:mm"),
        likes: 0,
        liked: false,
      };
  
      setReviews([newReview, ...reviews]);
      setReviewText("");
    };
  
    const toggleLike = (id) => {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id
            ? { ...review, liked: !review.liked, likes: review.liked ? review.likes - 1 : review.likes + 1 }
            : review
        )
      );
    };
  

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
  const [menuOpen, setMenuOpen] = useState(false); // Untuk mobile menu toggle
  const [searchTerm, setSearchTerm] = useState(""); // Untuk fitur pencarian
  const [filteredMovies, setFilteredMovies] = useState([]); // Untuk hasil pencarian
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Untuk menu profil dropdown

  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

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

        {/* Search Bar */}
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

        {/* Profile Icon */}
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

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 flex flex-col space-y-4 shadow-md z-50">
          <Link to="/" className="text-large text-red-500">Home</Link>
          <Link to="/movies" className="text-large hover:text-gray-400">Movies</Link>
          <Link to="/tv-series" className="text-large hover:text-gray-400">TV Series</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
          {/* Search Bar in Mobile */}
          <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white outline-none w-full placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-gray-400" />
          </div>
          {/* Logout in Mobile */}
          <button onClick={handleLogout} className="flex items-center px-4 mb-20 py-2 bg-red-500 rounded-lg">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center flex items-center text-left px-10 md:px-20" style={{ backgroundImage: "url('/bg-1.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Naruto Shipudden</h1>
          <p className="text-lg md:text-xl mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam beatae, quaerat eligendi enim laboriosam dolorem dolores rem consectetur hic saepe fugit cupiditate perspiciatis odit at inventore sapiente! Impedit, laboriosam numquam.</p>
          <button className="bg-red-600 px-6 py-3 text-lg font-semibold rounded-full hover:bg-red-700 transition-all">Learn More</button>
        </div>
      </section>

      {/* Movie Section */}
      <div className="relative mt-20 p-6">
        <h2 className="text-2xl font-semibold mb-4">You Might Like</h2>
        <div className="relative flex items-center">
          <button className="absolute left-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollLeft}>
            <FaChevronLeft size={24} />
          </button>
          <div ref={carouselRef} className="overflow-x-auto flex space-x-4 scrollbar-hide no-scrollbar w-full px-12">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <div key={index} className="min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
                  <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded-lg" />
                  <h4 className="text-lg font-semibold mt-2">{movie.title}</h4>
                  <p className="text-xs text-gray-300">{movie.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No movies found</p>
            )}
          </div>
          <button className="absolute right-0 z-10 bg-gray-900 p-3 rounded-full" onClick={scrollRight}>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-white">Reviews</h2>
      <div className="flex items-center space-x-4">
        <FaUserCircle className="text-gray-400 text-3xl" />
        <input
          type="text"
          placeholder="Add your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="flex-grow p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-500"
        />
        <button
          onClick={handleAddReview}
          className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-all"
        >
          <FaPaperPlane />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <FaUserCircle className="text-gray-400 text-2xl" />
              <div>
                <p className="text-white font-semibold">{review.username}</p>
                <p className="text-xs text-gray-400">{review.date}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-3">{review.text}</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleLike(review.id)}
                className="text-red-500 hover:text-red-700 transition-all"
              >
                {review.liked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span className="text-gray-400">{review.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Footer */}
      <Footer />
    </div>
  ) : null;
}
