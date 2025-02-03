import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/authHook"; // Import useAuth hook
import Footer from "../Components/Footer"; // Import Footer

export default function RegisterPage() {
  const { isAuthenticated, loading, register } = useAuth(); // Use useAuth hook to get authentication state and register method
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username); // Call register function from useAuth hook
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-transparent bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 border border-white/30">
          <h1 className="text-2xl font-bold text-center mb-4 text-white">Create Your Account</h1>
          <p className="text-gray-300 text-center mb-6">Please enter your desired username</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex text-white flex-col space-y-2">
              <input
                type="text"
                placeholder="Username"
                className="p-2 border rounded-md text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white  font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Register
            </button>
          </form>

          {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
        </div>
      </div>

      <Footer />
    </div>
  );
}
