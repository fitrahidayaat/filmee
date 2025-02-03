import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-4 md:px-20 mt-56">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center mb-6 md:mb-0">
          <span className="text-4xl font-bold text-white">FILMEE</span>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 mb-6 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-xl hover:text-blue-500 transition-all" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl hover:text-pink-500 transition-all" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-blue-400 transition-all" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-xl hover:text-red-600 transition-all" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center md:justify-between text-sm font-light text-gray-400 space-x-6">
          <a href="#" className="hover:text-white transition-all">Customer Service</a>
          <a href="#" className="hover:text-white transition-all">Cookie Preference</a>
          <a href="#" className="hover:text-white transition-all">Company Information</a>
          <a href="#" className="hover:text-white transition-all">Terms of Service</a>
          <a href="#" className="hover:text-white transition-all">Media</a>
          <a href="#" className="hover:text-white transition-all">Privacy</a>
          <a href="#" className="hover:text-white transition-all">Contact Us</a>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        <p>© 2025 FILMEE, All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
