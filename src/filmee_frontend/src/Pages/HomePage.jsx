import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";

const Navbar = () => {
    return (
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