import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer"; // Import Footer

export default function RegisterPage({ setIsAuthenticated }) {
  const [authService, setAuthService] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = new AuthService();
    auth.init().then(() => {
      setAuthService(auth);
      setIsAuthenticatedState(auth.isAuthenticated); // Set the state of authentication
      setLoading(false);
    });
  }, []);

  // If the user is authenticated, redirect them to the login page or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(username);
      setIsAuthenticated(true); // Set authenticated to true
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
              className="w-full bg-white text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200"
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
