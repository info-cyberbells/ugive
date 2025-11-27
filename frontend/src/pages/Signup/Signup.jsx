import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset, getUniversities, getColleges } from "../../features/studentSlice";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    university: "",
    college: "",
    phoneNumber: "",
    studentUniId: "",
  });

  const { user, isLoading, isError, isSuccess, message, universities, colleges } = useSelector(
    (state) => state.auth
  );
  const [showSignPassword, setShowSignPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: false,
    }));
  };

  //fetch public universities
  useEffect(() => {
    dispatch(getUniversities());
  }, [dispatch]);

  useEffect(() => {
    if (formData.university) {
      dispatch(getColleges(formData.university));
    }
  }, [formData.university, dispatch]);

  useEffect(() => {
    if (isError) {
      showToast(message || "Registration failed", "error");

      const backendErrors = {};

      if (message?.toLowerCase().includes("email")) backendErrors.email = true;
      if (message?.toLowerCase().includes("phone"))
        backendErrors.phoneNumber = true;
      if (message?.toLowerCase().includes("university"))
        backendErrors.university = true;
      if (message?.toLowerCase().includes("college"))
        backendErrors.college = true;
      if (message?.toLowerCase().includes("student"))
        backendErrors.studentUniId = true;
      if (message?.toLowerCase().includes("password"))
        backendErrors.password = true;
      if (message?.toLowerCase().includes("name")) backendErrors.name = true;

      setErrors((prev) => ({
        ...prev,
        ...backendErrors,
      }));

      setTimeout(() => dispatch(reset()), 150);
    }

    if (isSuccess && user) {
      showToast("Registration successful! Please login.");
      dispatch(reset());
      setTimeout(() => {
        window.location.replace("/");
      }, 1500);
    }
  }, [user, isError, isSuccess, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.password) newErrors.password = true;
    if (!formData.confirmPassword) newErrors.confirmPassword = true;
    if (!formData.phoneNumber) newErrors.phoneNumber = true;
    if (!formData.studentUniId) newErrors.studentUniId = true;
    if (!formData.university) newErrors.university = true;
    if (!formData.college) newErrors.college = true;


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all fields", "error");
      return;
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setErrors({ phoneNumber: true });
      showToast("Phone number must be digits", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        password: true,
        confirmPassword: true,
      });
      showToast("Passwords do not match", "error");
      return;
    }

    const { confirmPassword, ...finalData } = formData;

    // Submit form
    dispatch(register(finalData));
  };

  return (
    <div className="signup-main-Container">
      <div className="signup-inner_container">
        {/* Left Side */}
        <div className="signup-left-Container">
          <div className="signup-logo">
            <img src="/uGiveLogo.png" alt="Logo" />
          </div>

          <div className="signup-form">
            <div className="signup-form-section">
              <h1>Create an account</h1>
              <p>Make a difference in someone's life</p>

              <form autoComplete="off" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fakeusernameremembered"
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fakepasswordremembered"
                  style={{ display: "none" }}
                />

                <div className="signup-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`signup-input ${errors.name ? "input-error" : ""
                      }`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="email">Student Identifier</label>
                  <input
                    id="studentUniId"
                    name="studentUniId"
                    type="text"
                    className={`signup-input ${errors.studentUniId ? "input-error" : ""
                      }`}
                    placeholder="Enter your student ID"
                    value={formData.studentUniId}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="university">Your University</label>

                  <div className="relative">
                    <select
                      id="university"
                      name="university"
                      className={`signup-input appearance-none pr-10 ${errors.university ? "input-error" : ""
                        }`}
                      value={formData.university}
                      onChange={handleChange}
                    >
                      <option value="">Select your university</option>
                      {universities?.map((uni) => (
                        <option key={uni._id} value={uni._id}>
                          {uni.name}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>


                <div className="signup-form-group">
                  <label htmlFor="university">Your College</label>

                  <div className="relative">
                    <select
                      id="college"
                      name="college"
                      className={`signup-input appearance-none pr-10 ${errors.college ? "input-error" : ""
                        }`}
                      value={formData.college}
                      onChange={handleChange}
                      disabled={!formData.university}
                    >
                      <option value="">Select your college</option>
                      {colleges?.map((col) => (
                        <option key={col._id} value={col._id}>
                          {col.name}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>


                <div className="signup-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`signup-input ${errors.email ? "input-error" : ""
                      }`}
                    autoComplete="off"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="number">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    className={`signup-input ${errors.phoneNumber ? "input-error" : ""
                      }`}
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password-wrapper"
                    name="password"
                    type={showSignPassword ? "text" : "password"}
                    className={`signup-input ${errors.password ? "input-error" : ""
                      }`}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {showSignPassword ? (
                    <Eye
                      className="input-icon"
                      onClick={() => setShowSignPassword(!showSignPassword)}
                      size={18}
                    />
                  ) : (
                    <EyeOff
                      className="input-icon"
                      onClick={() => setShowSignPassword(!showSignPassword)}
                      size={18}
                    />
                  )}
                </div>

                <div className="signup-form-group">
                  <label htmlFor="password">Confirm Password</label>
                  <input
                    id="password-wrapper-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`signup-input ${errors.confirmPassword ? "input-error" : ""
                      }`}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {showConfirmPassword ? (
                    <Eye
                      className="input-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size={18}
                    />
                  ) : (
                    <EyeOff
                      className="input-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size={18}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="signup-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </form>

              <div className="signup-login-link">
                <p>
                  Already Have an account?{" "}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#E9B342",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="signup-image-section">
          <img
            src="/UgiveImg.png"
            alt="A group of people collaborating over a laptop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/eeeeee/31343c?text=Image+Not+Found";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;