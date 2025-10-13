import React from 'react'
import "../styles/signup.css"
import { NavLink } from 'react-router-dom';

const Signup = () => {
  return (
    <div className='main-Container'>
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
                
              </form>

              <div className="login-signup-link">
                <p>
                  Already Have an account? <button style={{background: "none", border: "none", color:"#E9B342", cursor: "pointer"}}>Login</button>
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
  )
}

export default Signup