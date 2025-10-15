import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../features/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);


  // ADD THIS useEffect:
  useEffect(() => {
    if (isError) {
      toast.error(message || "Login failed");
    }

    if (isSuccess && user) {
      toast.success("Login successful!");
      navigate("/student-dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(login(formData));
  };

  return (
    <div className="main-Container">
      <div className="inner_container">
        {/* Left Side (1/3) */}
        <div className="left-Container">
          <div className="logo">
            <img src="/uGiveLogo.png" alt="Logo" />
          </div>

          <div className="login-form">
            <div className="login-form-section">
              <h1>Create an account</h1>
              <p>Make a difference in someone's life</p>

              <form autoComplete="off" onSubmit={handleSubmit}>
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

                <div className="login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="login-input"
                    autoComplete="off"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="login-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="login-input"
                      autoComplete="new-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {showPassword ? (
                      <EyeOff
                        className="input-icon1"
                        onClick={() => setShowPassword(!showPassword)}
                        size={18}
                      />
                    ) : (
                      <Eye
                        className="input-icon1"
                        onClick={() => setShowPassword(!showPassword)}
                        size={18}
                      />
                    )}
                  </div>
                </div>

                <div className="login-options">
                  <div className="login-remember-me">
                    <input type="radio" id="rememberMe" />
                    <label htmlFor="rememberMe" style={{ paddingLeft: "4px" }}>Remember Me</label>
                  </div>
                  <div className="login-forgot-password">
                    <NavLink>Forgot Password?</NavLink>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </form>

              <div className="login-signup-link">
                <p>
                  Don't have an Account? <button style={{ background: "none", border: "none", color: "#E9B342", cursor: "pointer" }} onClick={() => navigate("/signup")}>Sign Up</button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (2/3) */}
        <div className="login-image-section">
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

export default Login;
