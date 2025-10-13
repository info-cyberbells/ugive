import React from "react";
import "../styles/login.css";
import { NavLink } from "react-router-dom";

const Login = () => {
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

              <form>
                <div className="login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="login-input"
                    defaultValue="Xavier@gmail.com"
                  />
                </div>

                <div className="login-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="login-input"
                    defaultValue="••••••••"
                  />
                </div>

                <div className="login-options">
                  <div className="login-remember-me">
                    <input type="radio" id="rememberMe" />
                    <label htmlFor="rememberMe" style={{paddingLeft: "4px"}}>Remember Me</label>
                  </div>
                  <div className="login-forgot-password">
                    <NavLink>Forgot Password?</NavLink>
                  </div>
                </div>

                <button type="submit" className="login-submit-btn">
                  Submit
                </button>
              </form>

              <div className="login-signup-link">
                <p>
                  Don't have an Account? <button style={{background: "none", border: "none", color:"#E9B342", cursor: "pointer"}}>Sign Up</button>
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
