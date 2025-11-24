import { useEffect, useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Handle page refresh/initial load
    const handlePageLoad = () => {
      setPageLoading(false);
    };

    if (document.readyState === 'complete') {
      setPageLoading(false);
    } else {
      window.addEventListener('load', handlePageLoad);
    }

    return () => window.removeEventListener('load', handlePageLoad);
  }, []);


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

  if (isLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signUp' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          {/* <Route path='/profile' element={<Profile />} /> */}
          <Route path='/manage-students' element={<ManageStudents />} />
          <Route path='/manage-universities' element={<ManageUniversities />} />
          <Route path='/manage-colleges' element={<ManageColleges />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
