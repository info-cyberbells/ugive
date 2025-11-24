import { useEffect, useState } from 'react';
import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { } from "react-router-dom";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/dashboard/dashboard';
import Navbar from './components/Navbar/Navbar';
// import Profile from './pages/Profile/Profile';
import ManageStudents from './pages/SuperAdmin/ManageStudents/ManageStudents'
import ManageUniversities from './pages/SuperAdmin/ManageUniversities/ManageUniversities';
import ManageColleges from './pages/SuperAdmin/ManageColleges/ManageColleges';




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path='/'
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path='/signUp'
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        <Route
          path='/dashboard'
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path='/manage-students'
          element={isAuthenticated ? <ManageStudents /> : <Navigate to="/" replace />}
        />
        <Route
          path='/manage-universities'
          element={isAuthenticated ? <ManageUniversities /> : <Navigate to="/" replace />}
        />
        <Route
          path='/manage-colleges'
          element={isAuthenticated ? <ManageColleges /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  )
}

export default App
