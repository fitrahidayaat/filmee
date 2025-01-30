import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../Service/AuthService";
import Footer from "../Components/Footer"; // Import Footer

export default function LoginPage({ setIsAuthenticated }) {
  const [authService, setAuthService] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = new AuthService();
    auth.init().then(() => {
      setAuthService(auth);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        await authService.login();
        navigate('/dashboard');
    } catch (error) {
        setMessage(error.message);
    }
};

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

          <form onSubmit={handleLogin} className="space-y-4">

            <div className="flex justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Remember Me</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Log In
            </button>
          </form>

          {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
