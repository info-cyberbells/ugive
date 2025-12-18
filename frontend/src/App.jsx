import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {} from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/superAdmin/superAdminDashboard/superAdminDashboard";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import ManageStudents from "./pages/SuperAdmin/ManageStudents/ManageStudents";
import ManageUniversities from "./pages/SuperAdmin/ManageUniversities/ManageUniversities";
import ManageColleges from "./pages/SuperAdmin/ManageColleges/ManageColleges";
import Social from "./pages/SuperAdmin/Social/Social";
import ManageRewards from "./pages/SuperAdmin/ManageRewards/ManageRewards";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndCondition from "./pages/TermsAndConditions/TermsAndCondition";
import RewardCatalogs from "./pages/RewardCatalogs/RewardCatalogs";
import WriteCard from "./pages/WriteCard/WriteCard";
import StudentDashboard from "./pages/dashboard/StudentDashbaord";
import LetsGo from "./pages/LetsGo/LetsGo";
import MyStudentProfile from "./pages/Profile/MyStudentProfile";
import MyCardReading from "./pages/MyCardReading/MyCardReading";
import Friends from "./pages/Friends/Friends";
import Contactus from "./pages/Contactus.jsx/Contactus";
import Streaks from "./pages/Streaks/Streaks";
import Feedback from "./pages/SuperAdmin/ManageFeedback/ManageFeedback";
import NotificationPage from "./pages/NotificationPage/NotificationPage";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminManageStudents from "./pages/Admin/AdminManagestudents/AdminManageStudents";
import AdminColleges from "./pages/Admin/AdminColleges/AdminColleges";
import AdminManageCards from "./pages/Admin/AdminCardsManage/AdminCardsManage";
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins/ManageAdmins";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      setIsAuthenticated(!!token);

      if (user) {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser.role);
      }

      setIsLoading(false);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
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
          path="/"
          element={
            isAuthenticated ? (
              userRole === "student" ? (
                <Navigate to="/student-dashboard" replace />
              ) : userRole === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signUp"
          element={
            isAuthenticated ? (
              userRole === "student" ? (
                <Navigate to="/student-dashboard" replace />
              ) : userRole === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              userRole === "student" ? (
                <Navigate to="/student-dashboard" replace />
              ) : userRole === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Dashboard />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/student-dashboard"
          element={
            isAuthenticated ? <StudentDashboard /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/manage-students"
          element={
            isAuthenticated ? <ManageStudents /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/manage-universities"
          element={
            isAuthenticated ? (
              <ManageUniversities />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/manage-colleges"
          element={
            isAuthenticated ? <ManageColleges /> : <Navigate to="/" replace />
          }
        />

        <Route path="/manage-admins" element={isAuthenticated ? <ManageAdmins /> : <Navigate to="/" replace />} />

        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
        />

        <Route
          path="/manage-rewards"
          element={
            isAuthenticated ? <ManageRewards /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/feedbacks"
          element={isAuthenticated ? <Feedback /> : <Navigate to="/" replace />}
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationPage /> : <Navigate to="/" replace />
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
        <Route path="/contactus" element={<Contactus />} />

        <Route
          path="/rewards-catalog"
          element={
            isAuthenticated ? <RewardCatalogs /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/my-profile"
          element={
            isAuthenticated ? <MyStudentProfile /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/my-cards"
          element={
            isAuthenticated ? <MyCardReading /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/social"
          element={isAuthenticated ? <Social /> : <Navigate to="/" replace />}
        />

        <Route
          path="/write-card"
          element={
            isAuthenticated ? <WriteCard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/lets-go"
          element={isAuthenticated ? <LetsGo /> : <Navigate to="/" replace />}
        />
        <Route
          path="/friends"
          element={isAuthenticated ? <Friends /> : <Navigate to="/" replace />}
        />
        <Route
          path="/streaks"
          element={isAuthenticated ? <Streaks /> : <Navigate to="/" replace />}
        />

        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin-students"
          element={
            isAuthenticated ? (
              <AdminManageStudents />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin-colleges"
          element={
            isAuthenticated ? <AdminColleges /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin-cards"
          element={
            isAuthenticated ? <AdminManageCards /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              userRole === "student" ? (
                <Navigate to="/student-dashboard" replace />
              ) : userRole === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
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
  );
}

export default App;
