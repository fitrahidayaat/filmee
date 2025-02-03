import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer"; // Import Footer
import { useAuth } from "../Hooks/authHook";

export default function LoginPage({ setIsAuthenticated }) {
  const {login, loading} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      {/* Container dengan efek transparan dan glassmorphism */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-transparent bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 border border-white/30">
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
            Welcome Back!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Log In
            </button>
          </form>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
