import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useBoards } from '../context/BoardContext';

const Login = () => {
  const { fetchBoards } = useBoards();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
 // here i did change s for the login connectivity with backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("https://taskflow-im15.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem("token", data.token);

    // 
    localStorage.setItem("user", JSON.stringify(data.user));
    await fetchBoards(); // Refresh boards
    alert("Login successful!");
    navigate("/homepage");
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <>
    <Navbar/>
    <div className="login-page">
      <div className="login-container">
        <div className="login-card-wrapper">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo-wrapper">
              <div className="login-logo-circle">
                <CheckCircle className="login-logo-icon" />
              </div>
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your TaskFlow account</p>
          </div>

          {/* Login Form */}
          <div className="login-form-card">
            <form onSubmit={handleSubmit} className="form-space-y-6">
              <div>
                <label className="form-label">Email</label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <Mail className="input-icon" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-text-icon"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <Lock className="input-icon" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input-password"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-button"
                  >
                    {showPassword ? (
                      <EyeOff className="input-icon-hover" />
                    ) : (
                      <Eye className="input-icon-hover" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options-row">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label className="checkbox-label">Remember me</label>
                </div>
                <Link to="/forgot-password" className="link-text-sm">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="submit-button"
                onSubmit={handleSubmit}
              >

                Sign In
              </button>
            </form>

            {/* Separator */}
            <div className="separator-container">
              <div className="separator-line" />
              <div className="separator-text-wrapper">
                <span className="separator-text">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="social-buttons-grid">
              <button className="social-button">
                <span className="social-button-text">Google</span>
              </button>
              <button className="social-button">
                
                <span className="social-button-text">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link-wrapper">
              <p className="signup-text">
                Don't have an account?{' '}
                <Link to="/signup" className="link-text-bold">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default Login;
