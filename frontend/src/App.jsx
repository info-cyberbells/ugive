import { useEffect, useState } from 'react';
import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { } from "react-router-dom";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/superAdmin/superAdminDashboard/superAdminDashboard';
import Navbar from './components/Navbar/Navbar';
import Profile from './pages/Profile/Profile';
import ManageStudents from './pages/SuperAdmin/ManageStudents/ManageStudents'
import ManageUniversities from './pages/SuperAdmin/ManageUniversities/ManageUniversities';
import ManageColleges from './pages/SuperAdmin/ManageColleges/ManageColleges';
import Social from './pages/SuperAdmin/Social/Social';
import ManageRewards from './pages/SuperAdmin/ManageRewards/ManageRewards';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndCondition from './pages/TermsAndConditions/TermsAndCondition';
import RewardCatalogs from './pages/RewardCatalogs/RewardCatalogs';
import WriteCard from './pages/WriteCard/WriteCard';
import StudentDashboard from './pages/dashboard/StudentDashbaord';
import LetsGo from './pages/LetsGo/LetsGo';
import MyStudentProfile from './pages/Profile/MyStudentProfile';
import MyCardReading from './pages/MyCardReading/MyCardReading';




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);



  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      setIsAuthenticated(!!token);

      if (user) {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser.role);
      }

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
          element={
            isAuthenticated ? (
              userRole === 'student' ? (
                <Navigate to="/student-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path='/signUp'
          element={
            isAuthenticated ? (
              userRole === 'student' ? (
                <Navigate to="/student-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path='/dashboard'
          element={
            isAuthenticated ? (
              userRole === 'student' ? (
                <Navigate to="/student-dashboard" replace />
              ) : (
                <Dashboard />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path='/student-dashboard'
          element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/" replace />}
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

        <Route
          path='/profile'
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
        />

        <Route path="/manage-rewards" element={isAuthenticated ? <ManageRewards /> : <Navigate to='/' replace />}
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<TermsAndCondition />}
        />


        <Route path='/rewards-catalog' element={isAuthenticated ? <RewardCatalogs /> : <Navigate to="/" replace />} />

        <Route path="/my-profile" element={isAuthenticated ? <MyStudentProfile /> : <Navigate to='/' replace />}
        />

        <Route path="/my-cards" element={isAuthenticated ? <MyCardReading /> : <Navigate to='/' replace />}
        />

        <Route
          path='/social'
          element={isAuthenticated ? <Social /> : <Navigate to="/" replace />}
        />

        <Route path='/write-card' element={isAuthenticated ? <WriteCard /> : <Navigate to="/" replace />} />
        <Route path='/lets-go' element={isAuthenticated ? <LetsGo /> : <Navigate to="/" replace />} />

        <Route
          path='*'
          element={
            isAuthenticated ? (
              userRole === 'student' ? (
                <Navigate to="/student-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  )
}

export default App
