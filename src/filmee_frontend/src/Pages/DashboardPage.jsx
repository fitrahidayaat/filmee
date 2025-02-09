import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaUser, FaFilter } from "react-icons/fa";
import { useAuth } from "../Hooks/authHook";
import Footer from "../Components/Footer";
import { filmee_backend } from "../../../declarations/filmee_backend";
import Carousel from "../Components/ui/Carousel";
import Search from "../Components/ui/Search";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout, principal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [movies, setMovies] = useState();
  const [horror, setHorror] = useState();
  const [action, setAction] = useState();
  const [adventure, setAdventure] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [user, setUser] = useState();

  // Refs for carousels
  const youMightLikeRef = useRef(null);
  const horrorRef = useRef(null);
  const actionRef = useRef(null);
  const adventureRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!loading && !isAuthenticated) {
        navigate("/login"); // Redirect to homepage if not authenticated
        return;
      }

      try {
        const user = await filmee_backend.getUserById(principal.toText());
        setUser(user);
        const histories = user[0].histories;

        const blob = new Blob([user[0].profilePic[0]]);
        const url = URL.createObjectURL(blob);
        setImagePreview(url);

        // If histories is empty, fetch movies from a different backend call
        if (histories && histories.length === 0) {
          const defaultMovies = await filmee_backend.getAllMovies(10); // Your method to fetch movies
          setMovies(defaultMovies);
        } else {
          const defaultMovies = await filmee_backend.getRecommendationUser(principal.toText(), 10);
          const parse = JSON.parse(defaultMovies).recommendations;

          // Function to convert object keys to lowercase
          const keysToLowerCase = (obj) => {
            return Object.keys(obj).reduce((acc, key) => {
              acc[key.toLowerCase()] = obj[key];
              return acc;
            }, {});
          };

          // Convert all objects in the array to lowercase key format
          const lowerCaseMovies = parse.map((movie) => keysToLowerCase(movie));
          setMovies(lowerCaseMovies);

        }
        const horrorMovies = await filmee_backend.searchMovieByGenre('horror', 0, 10);
        setHorror(horrorMovies);

        const actionMovies = await filmee_backend.searchMovieByGenre('action', 0, 10);
        setAction(actionMovies);

        const adventureMovies = await filmee_backend.searchMovieByGenre('adventure', 0, 10);
        setAdventure(adventureMovies);
      } catch (error) {
        console.error("Error fetching user or movies:", error);
      }
    };

    fetchUser(); // Call the fetchUser function when the component mounts or dependencies change
  }, [isAuthenticated, loading, navigate, principal]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  }

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth"
      });
    }
  };

  const [showRating, setShowRating] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const options = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "TV Movie",
  ];
  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      // If already selected, remove it
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      // If not selected, add it
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  if (loading || !isAuthenticated) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between montserrat tracking-wide space-x-16">
      {/* Navbar */}
      <nav className="bg-transparent p-4 flex justify-between items-center fixed w-full z-50 top-0 left-0 px-10 md:px-20 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">FILMEE</h1>

        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="text-large text-red-500">Home</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
        </div>
        <div className="flex justify-center items-center gap-5">
          <div className="hidden md:flex items-center bg-gray-800 px-4 py-2 rounded-full">
            <Search selectedOptions={selectedOptions} minRating={minRating} />
          </div>
          <div className="relative">
            {user && user[0].tier != "free" && <FaFilter onClick={() => { setShowRating((prev) => !prev) }} className="cursor-pointer" />}
            
            {showRating && (
              <>
                <div className="absolute right-0 w-200 bg-gray-900 text-white mt-4 shadow-lg rounded-lg overflow-hidden z-50 p-10">
                  <h2 className="text-xl font-bold mb-4">Filter</h2>
                  <div className="flex gap-8 mb-4">
                    <label htmlFor="">Min. Rating</label>
                    <input type="number" className="w-80 h-4 text-white" max="10" min="0" defaultValue={0} onChange={(e) => {setMinRating(Number(e.target.value))}} />
                  </div>
                  <h2>Genre</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    {options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 bg-transparent p-3 rounded-md shadow-sm text-white  hover:text-gray-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                          className="form-checkbox h-5 w-5 text-white rounded"
                        />
                        <span className=" ">{option}</span>
                      </label>
                    ))}
                  </div>

                </div>
              </>
            )}

          </div>
        </div>

        <div className="hidden md:flex items-center relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            {user && user[0].profilePic[0] ? <img src={imagePreview} alt="" className="h-14 w-14 object-cover rounded-full cursor-pointer" /> : <FaUserCircle className="w-10 h-10" />}

          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 w-40 bg-gray-900 text-white mt-30 shadow-lg rounded-lg overflow-hidden z-50">
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
          <Link to="/" className="text-large text-red-500">Home</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
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
          <button onClick={handleLogout} className="flex items-center px-4 mb-20 py-2 bg-red-500 rounded-lg">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center flex items-center text-left px-10 md:px-20" style={{ backgroundImage: "url('https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 max-w-6xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">Spider-Man: No Way Home</h1>
          <p className="text-lg md:text-xl mb-6 text-gray-400">Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.</p>
          <Link className="bg-red-600 px-6 py-3 text-lg font-semibold rounded-full hover:bg-red-700 transition-all" to={"/movie/Spider-Man: No Way Home"}>Learn More</Link>
        </div>
      </section>

      {/* You Might Like Sections */}
      <Carousel
        ref={youMightLikeRef}
        title="You Might Like"
        movies={movies}
        scroll={scroll}
      />

      {/* Horror Sections */}
      <Carousel
        ref={horrorRef}
        title="Horror"
        movies={horror}
        scroll={scroll}
      />

      {/* Action Sections */}
      <Carousel
        ref={actionRef}
        title="Action"
        movies={action}
        scroll={scroll}
      />

      {/* Adventure Sections */}
      <Carousel
        ref={adventureRef}
        title="Adventure"
        movies={adventure}
        scroll={scroll}
      />

      <Footer />
    </div>
  );
}