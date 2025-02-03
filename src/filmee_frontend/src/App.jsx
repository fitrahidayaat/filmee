import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import YourWatchListPage from "./Pages/YourWatchlistPage";
import UserProfilePage from "./Pages/UserProfilePage";
import MoviePage from './Pages/MoviePage';
import HomePage from "./Pages/HomePage";
import SearchPage from './Pages/SearchPage';
import { useAuth } from "./Hooks/authHook";
import PlansPage from "./Pages/PlansPage";


function AppWrapper() {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white text-lg">Loading...</div>;
  }

  return (
    <Router>
      
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/watchlist"
          element={isAuthenticated ? <YourWatchListPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/movie/:title"
          element={isAuthenticated ? <MoviePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/search/:term"
          element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/plan"
          element={isAuthenticated ? <PlansPage /> : <Navigate to="/login" replace />}
          />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
