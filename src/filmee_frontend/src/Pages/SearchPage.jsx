import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams  } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaUser, FaFilter } from "react-icons/fa";
import { useAuth } from "../Hooks/authHook";
import Footer from "../Components/Footer";
import { filmee_backend } from "../../../declarations/filmee_backend";
import { ClipLoader } from 'react-spinners';  // Import the loader
import Search from "../Components/ui/Search";

export default function SearchPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout, principal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [movies, setMovies] = useState();
  const params = useParams();
  const [imagePreview, setImagePreview] = useState();
  const [searchParams] = useSearchParams();
  const term = params.term;
  const [user, setUser] = useState();
  let genre = searchParams.get('selectedOptions');
  if(genre) {
    genre = searchParams.get('selectedOptions').split(',')
  }
  const rating = Number(searchParams.get('minRating'));

  useEffect(() => {
    const fetchUser = async () => {
      if (!loading && !isAuthenticated) {
        navigate("/login"); // Redirect to homepage if not authenticated
        return;
      }

      try {
        const user = await filmee_backend.getUserById(principal.toText());
        const blob = new Blob([user[0].profilePic[0]]);
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        // If histories is empty, fetch movies from a different backend call
        let defaultMovies;
        console.log(genre, rating,  user[0].tier);
        if((user[0].tier == "tier1" || user[0].tier == "tier2") && genre && rating != undefined) {  
          console.log("asdsa");
          defaultMovies = await filmee_backend.searchMovieByTitleUsingFilter(term, genre, rating, 0, 20);
        } else {
          console.log("tes");
          defaultMovies = await filmee_backend.searchMovieByTitle(params.term, 0, 20);
        }
        setUser(user[0]);
        setMovies(defaultMovies);
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
            {user && user.tier != "free" && <FaFilter onClick={() => { setShowRating((prev) => !prev) }} className="cursor-pointer" />}

            {showRating && (
              <>
                <div className="absolute right-0 w-200 bg-gray-900 text-white mt-4 shadow-lg rounded-lg overflow-hidden z-50 p-10">
                  <h2 className="text-xl font-bold mb-4">Filter</h2>
                  <div className="flex gap-8 mb-4">
                    <label htmlFor="">Min. Rating</label>
                    <input type="number" className="w-80 h-4 text-white" max="10" min="0" defaultValue={0} onChange={(e) => { setMinRating(Number(e.target.value)) }} />
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
            {user && user.profilePic[0] ? <img src={imagePreview} alt="" className="h-14 w-14 object-cover rounded-full cursor-pointer" /> : <FaUserCircle className="w-10 h-10" />}

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


      <div className="mt-30 px-10 md:px-20">
        <h2 className="text-3xl font-bold mb-8 ">Search Results</h2>
        <div
          className="flex gap-4 w-full px-12 flex-wrap"
        >
          {movies ? (
            movies.map((movie, index) => (
              <Link
                to={`/movie/${movie.title}`}
                key={index}
                className="max-w-[250px] bg-gray-800 p-4 rounded-4xl shadow-lg relative transform transition-all duration-300 scale-95 hover:scale-100 hover:shadow-xl hover:z-20"
                style={{
                  backgroundImage: `url(${movie.poster_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "300px", // Set the height for the card
                }}
              >
                {/* Overlay with background opacity */}
                <div className="absolute inset-0 bg-black opacity-20 rounded-4xl"></div>

                <div className="relative z-10 h-full p-4 rounded-4xl flex flex-col justify-end">
                  <h4 className="text-xl font-bold text-white">{movie.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{movie.overview}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-80">
              <ClipLoader size={50} color={"#ffffff"} loading={true} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}