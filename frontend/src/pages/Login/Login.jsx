import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../features/studentSlice";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ForgotPassword from "../ForgotPasswordModel/ForgotPasswordModel";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (isError) {
      showToast(message || "Invalid email or password", "error");
      dispatch(reset());
    }

    if (isSuccess && user) {
      showToast("Login successful!", "success");
      dispatch(reset());
      setTimeout(() => {
        window.dispatchEvent(new Event('authChange'));

        if (user.role === 'student') {
          navigate("/student-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 700);
    }
  }, [isError, isSuccess, message, navigate, dispatch, user]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email) newErrors.email = true;
    if (!formData.password) newErrors.password = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Please fill in all fields", "error");
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

                <div className="login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`login-input ${errors.email ? "input-error" : ""
                      }`}
                    autoComplete="off"
                    placeholder="john.doe@usq.edu.au"
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
                      className={`login-input ${errors.password ? "input-error" : ""
                        }`}
                      autoComplete="new-password"
                      placeholder="Password@123"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {showPassword ? (
                      <Eye
                        className="input-icon1"
                        onClick={() => setShowPassword(!showPassword)}
                        size={18}
                      />
                    ) : (
                      <EyeOff
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
                    <label htmlFor="rememberMe" style={{ paddingLeft: "4px" }}>
                      Remember Me
                    </label>
                  </div>
                  <div className="login-forgot-password">
                    <button type="button"
                    className="cursor-pointer hover:text-gray-900 transition "
                     onClick={() => setOpen(true)}
                    >Forgot Password</button>
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
                  Don't have an Account?{" "}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#E9B342",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (2/3) */}
        <div className="login-image-section">
          <img
            src="/UgiveImg.jpg"
            alt="A group of people collaborating over a laptop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/eeeeee/31343c?text=Image+Not+Found";
            }}
          />
        </div>
      </div>
      <ForgotPassword
      isOpen={open}
      onClose={()=> setOpen(false)}
      />
    </div>
  );
};

export default Login;
