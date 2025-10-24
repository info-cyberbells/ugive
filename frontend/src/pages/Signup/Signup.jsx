import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../features/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./signup.css"
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    university: "",
    phoneNumber: "",
    studentUniId: "",
  });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [showSignPassword, setShowSignPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed");
    }

    if (isSuccess && user) {
      toast.success("Registration successful!");
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);


  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, role, university, phoneNumber, studentUniId } = formData;

    if (!name || !email || !password || !role || !university || !phoneNumber || !studentUniId) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(register(formData));
  };
  return (
    <div className='signup-main-Container'>
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
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

                <div className="signup-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="signup-input"
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
                    className="signup-input"
                    placeholder="Enter your student ID"
                    value={formData.studentUniId}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="university">Your University</label>
                  <input
                    id="university"
                    name="university"
                    type="text"
                    className="signup-input"
                    placeholder="Enter your university"
                    value={formData.university}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="signup-input"
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
                    className="signup-input"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password-wrapper"
                    name="password"
                    type={showSignPassword ? "text" : "password"}
                    className="signup-input"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange} />
                  {showSignPassword ? (
                    <EyeOff
                      className="input-icon"
                      onClick={() => setShowSignPassword(!showSignPassword)}
                      size={18}
                    />
                  ) : (
                    <Eye
                      className="input-icon"
                      onClick={() => setShowSignPassword(!showSignPassword)}
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
                  Already Have an account? <button style={{ background: "none", border: "none", color: "#E9B342", cursor: "pointer" }} onClick={() => navigate("/")}>Login</button>
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
              e.target.src = "https://placehold.co/600x400/eeeeee/31343c?text=Image+Not+Found";
            }}
          />
        </div>
      </div>
    </div>

  )
}

export default Signup