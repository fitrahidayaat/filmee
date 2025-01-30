<<<<<<< HEAD
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";
=======
import React, { useState, useEffect } from "react";
import { AuthService } from "../Service/AuthService";
import { filmee_backend } from "../../../declarations/filmee_backend";

function App() {
    const [authService, setAuthService] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const auth = new AuthService();
        auth.init().then(() => {
            setAuthService(auth);
            setPrincipal(auth.principal);
            setIsAuthenticated(auth.isAuthenticated);
            setLoading(false);
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const a  = await authService.register(username);
            console.log(a);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleGetUser = async () => {
        try {
            const user = await filmee_backend.getUserById(principal.toText());
            setMessage(user.username);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const profilePic = e.target.image.files[0];
    
        // Read the file content as text
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
            const fileContent = event.target.result; // This is the text content of the file
    
            // Update the user profile with the text content
            const res = await filmee_backend.updateUserProfile(principal.toText(), {
                "username": [username],
                "profilePic": [fileContent] // Save the text content instead of the file object
            });

            // setImage(fileContent);
            console.log(res);
        };
    
        // Read the file as a data URL
        fileReader.readAsDataURL(profilePic);
    };

    const fetchUserData = async () => {
        try {
            // Fetch user data by ID
            let user = await filmee_backend.getUserById(principal.toText());
            console.log("User Data:", user);
            user = user[0]
            console.log(user.profilePic[0]);
            // Update the user data state
            setUserData(user);

            // If the user has a profile picture, update the image state
            if (user.profilePic) {
                setImage(user.profilePic[0]);
            } else {
                setImage(null); // Clear the image if no profile picture exists
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
>>>>>>> 14a3929a952e8bbfd175cc6d3d95bac0870ca9b1

const Navbar = () => {
    return (
<<<<<<< HEAD
      <nav className="flex justify-between items-center px-6 md:px-20 py-4 bg-black bg-opacity-50 fixed w-full top-0 z-50">
        <h1 className="text-white text-3xl font-bold">FILMEE</h1>
        <div className="space-x-4">
          <a href="/login">
            <button className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-black transition-all">
              Log in
            </button>
          </a>
          <a href="/register">
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition-all">
              Sign up
            </button>
          </a>
=======
        <div>
            <h1 className="text-4xl">User Authentication with Principal</h1>
            {isAuthenticated ? (
                <div>
                    <p>Logged in as: {principal.toText()}</p>
                    {image && <img src={image} alt="Profile" />} {/* Display the image if it exists */}
                    <form action="" onSubmit={() => { authService.logout() }}>
                        <button type="submit">Logout</button>
                    </form>
        
                    <form action="" onSubmit={updateProfile}>
                        <input type="text" name="username" />
                        <input type="file" name="image" accept="image/*" /> {/* Accept only image files */}
                        <button type="submit">Update Profile</button>
                    </form>
        
                    {/* Button to fetch user data */}
                    <button onClick={fetchUserData}>Fetch User Data</button>
        
                    {/* Display user data if available */}
                    {userData && (
                        <div>
                            <h3>User Details</h3>
                            <p>Username: {userData.username}</p>
                            <p>Tier: {userData.tier}</p>
                            <p>Tier Valid Until: {Date(Number(userData.tierValidUntil))}</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <form onSubmit={handleLogin}>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">Login</button>
                    </form>
                    <form onSubmit={handleRegister}>
                        username <input type="text" onChange={(e) => setUsername(e.target.value)} />
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">Register</button>
                    </form>
                </>
            )}
>>>>>>> 14a3929a952e8bbfd175cc6d3d95bac0870ca9b1
        </div>
      </nav>
    );
  };
  

const Hero = () => {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-center text-white"
      style={{ backgroundImage: `url("./bg.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Your Next Favorite Movie Awaits 🎬
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        No more endless scrolling! Discover the best movies tailored to your taste with smart recommendations.
      </motion.p>
    </div>
  );
};

const benefits = [
    { title: "Find the Perfect Movie", desc: "Discover movies that match your taste effortlessly.", icon: "🎥" },
    { title: "Save Your Favorites", desc: "Keep track of movies you love and watch later.", icon: "❤️" },
    { title: "Discover Without Spoilers", desc: "Get recommendations without unwanted spoilers!", icon: "🚫" },
    { title: "Smart Search & Filters", desc: "Find exactly what you're looking for quickly.", icon: "🔍" },
  ];
  
  const Benefits = () => {
    return (
      <div
        className="py-20 text-white text-center"
        style={{ backgroundImage: `url("./bg.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <h2 className="text-4xl font-bold mb-10">Why Choose FILMEE?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 md:px-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 bg-opacity-80 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
      { question: "What is Filmee?", answer: "Filmee is a smart movie recommendation platform that helps you discover movies based on your preferences." },
      { question: "How does Filmee recommend movies?", answer: "Filmee uses AI-powered algorithms and user preferences to suggest movies that match your interests." },
      { question: "How does spoiler detection work?", answer: "Filmee filters reviews and recommendations to avoid spoilers so you can enjoy surprises." },
      { question: "Is Filmee free to use?", answer: "Yes! Filmee is completely free for users to explore and enjoy movie recommendations." },
    ];
  
    return (
      <div
        className="py-20 text-white text-center px-10 md:px-40"
        style={{ backgroundImage: `url("./bg.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <h2 className="text-4xl font-bold mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-80 p-4 rounded-lg cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <h3 className="text-lg font-semibold flex justify-between">
                {faq.question} <span>{openIndex === index ? "➖" : "➕"}</span>
              </h3>
              {openIndex === index && <p className="text-gray-300 mt-2">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const App = () => {
    return (
      <div>
        <Navbar />
        <Hero />
        <Benefits />
        <FAQ />
        <Footer />
      </div>
    );
  };
  
  export default App;