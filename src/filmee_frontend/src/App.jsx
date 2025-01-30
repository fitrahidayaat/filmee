import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import MoviesPage from "./Pages/MoviesPage";
import TvSeriesPage from "./Pages/TVSeriesPage";
import YourWatchListPage from "./Pages/YourWatchlistPage";
import ReviewFilmPage from "./Pages/ReviewMovie";
import UserProfilePage from "./Pages/UserProfilePage";
import { AuthService } from "./Service/AuthService";
import HomePage from "./Pages/HomePage";


function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authService = new AuthService();
    authService.init().then(() => {
      setIsAuthenticated(authService.isAuthenticated);
      localStorage.setItem("isAuthenticated", authService.isAuthenticated ? "true" : "false");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white text-lg">Loading...</div>;
  }

  return (
    <Router>
      
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/movies"
          element={isAuthenticated ? <MoviesPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/tv-series"
          element={isAuthenticated ? <TvSeriesPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/watchlist"
          element={isAuthenticated ? <YourWatchListPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/review"
          element={isAuthenticated ? <ReviewFilmPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={<UserProfilePage />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
