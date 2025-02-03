import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaStar, FaUser, FaPaperPlane, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useAuth } from "../Hooks/authHook";
import Footer from "../Components/Footer";
import { filmee_backend } from "../../../declarations/filmee_backend";
import { ClipLoader } from 'react-spinners';  // Import the loader
import Carousel from "../Components/ui/Carousel";
import profile from "../../public/profile.png";
import ReviewBox from "../Components/ui/ReviewBox";
import Search from "../Components/ui/Search";
const review = {
  name: "Samsul",
  date: "01/01/2024",
  comment: "It’s a decent movie with solid performances, but I feel like it didn’t live up to the massive hype. The pacing was a bit uneven, and some plot points felt predictable. Still, it's worth a watch for the action scenes alone.",
  upVote: 445,
  downVote: 1
}

export default function MoviePage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout, principal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState();
  const [user, setUser] = useState();
  const [isBookmarked, setIsBookmarked] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [horror, setHorror] = useState();
  const [action, setAction] = useState();
  const [adventure, setAdventure] = useState();
  const [tier, setTier] = useState("free");
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
      window.scrollTo(0, 0);

      try {
        const user = await filmee_backend.getUserById(principal.toText());
        setUser(user[0]);
        const histories = user[0].histories;
        const blob = new Blob([user[0].profilePic[0]]);
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        const m = await filmee_backend.searchMovieByTitle(params.title, 0, 1);
        setMovie(m[0]);
        setIsBookmarked(user[0].bookmark.find(movie => movie.id === m[0].id) !== undefined);
        setTier(user[0].tier);

        const rvw = await filmee_backend.getReviewsByMovieId(m[0].id);
        setReviews(rvw);
        await filmee_backend.addHistory(principal.toText(), m[0].title);

        // If histories is empty, fetch movies from a different backend call
        if (histories && histories.length === 0) {
          const defaultMovies = await filmee_backend.getAllMovies(10); // Your method to fetch movies
          setMovies(defaultMovies);
        } else {
          const defaultMovies = await filmee_backend.getRecommendation(params.title, 10);
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

          const horrorMovies = await filmee_backend.searchMovieByGenre('horror', 0, 10);
          setHorror(horrorMovies);

          const actionMovies = await filmee_backend.searchMovieByGenre('action', 0, 10);
          setAction(actionMovies);

          const adventureMovies = await filmee_backend.searchMovieByGenre('adventure', 0, 10);
          setAdventure(adventureMovies);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await filmee_backend.addReview(principal.toText(), movie.id, e.target.comment.value);
    const rvw = await filmee_backend.getReviewsByMovieId(movie.id);
    e.target.comment.value = "";
    setReviews(rvw);
  }

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth"
      });
    }
  };

  const handleBookmark = async () => {
    const res = await filmee_backend.toggleBookmark(principal.toText(), movie.id);
    setIsBookmarked((prev) => !prev);
  }


  let spoilerDetection = "";

  const [hideSpoilers, setHideSpoilers] = useState(false);

  if (tier === "tier2") {
    spoilerDetection = (
      <div>
        <label>
          <input type="checkbox" onChange={(e) => setHideSpoilers(e.target.checked)} /> Hide Spoilers
        </label>
      </div>
    );
  }

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

        <div className="hidden md:flex items-center bg-gray-800 px-4 py-2 rounded-full">
          <Search />
        </div>

        <div className="hidden md:flex items-center relative">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            {user && user.profilePic[0] ? <img src={imagePreview} alt="" className="h-14 w-14 object-cover rounded-full cursor-pointer" /> : <FaUserCircle className="w-10 h-10" />}
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
          <Link to="/" className="text-large text-red-500">Home</Link>
          <Link to="/watchlist" className="text-large hover:text-gray-400">Your Watchlist</Link>
          <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
            <Search />
          </div>
          <button onClick={handleLogout} className="flex items-center px-4 mb-20 py-2 bg-red-500 rounded-lg">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}

      {/* Hero Section */}
      {movie ? (
        <section
          className="relative w-full h-screen bg-cover bg-center flex items-center text-left px-10 md:px-20"
          style={{ backgroundImage: `url('${movie.poster_url}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          <div className="relative z-10 max-w-6xl">
            <button className="flex bg-stone-800 rounded-2xl max-w-40 gap-5 justify-center items-center px-4 py-2 mb-4 cursor-pointer" onClick={handleBookmark}>
              {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              Bookmark
            </button>
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">{movie.title}</h1>
            <p className="text-lg md:text-xl flex gap-2 mb-4"><FaStar color="yellow" />{movie.vote_average}/10 ({Number(movie.vote_count)} votes) | Release Date : {movie.release_date} | Language : {movie.original_language}</p>
            <p className="text-lg md:text-xl mb-6 text-gray-300 max-w-5xl">
              {movie.overview}
            </p>
          </div>
        </section>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900">
          <div className="animate-pulse text-gray-300">
            Loading featured content...
          </div>
        </div>
      )}


      {/* More Like This Sections */}
      <Carousel
        ref={youMightLikeRef}
        title="More Like This"
        movies={movies}
        scroll={scroll}
      />

      {/* Reviews */}
      <div className="md:px-20 mt-10">
        <div className="flex gap-8 items-center mb-10">
          <h2 className="text-3xl font-bold">Reviews</h2>
          {spoilerDetection}
        </div>

        {/* add review */}
        <div className="flex gap-8">
          {user && user.profilePic[0] ? <img src={imagePreview} alt="" className="h-20 w-20 object-cover rounded-full cursor-pointer" /> : <FaUserCircle className="w-20 h-20" />}
          <div className="w-full flex flex-col gap-2">
            <h3>{user ? user.username : ""}</h3>
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
              <input type="text" name="comment" className="bg-white rounded-md px-4 py-2 text-black w-full" placeholder="Add your review here..." />
              <button className="bg-white text-black rounded-full h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-gray-200" type="submit">
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>

        {reviews ? reviews.map((item, index) => (
          <ReviewBox review={item} key={index} isHideSpoiler={hideSpoilers} />
          // item
        )) : <></>}

      </div>

      <Footer />
    </div>
  );
}