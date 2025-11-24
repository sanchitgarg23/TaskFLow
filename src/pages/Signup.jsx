
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Building } from 'lucide-react';
import './Signup.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };


  // here i did change s for the signup  or signup connectivity with backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error);
    // localStorage.setItem("token", data.token);
    // navigate()  if we want to directly go to dashboard inspite of going to login page
    alert("Signup successful! Please login.");
    navigate("/login");
  } catch (err) {
    alert(err.message);
  }
};


  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColorClass = (strength) => {
    if (strength < 2) return 'strength-weak';
    if (strength < 4) return 'strength-medium';
    return 'strength-strong';
  };

  const getStrengthTextColorClass = (strength) => {
    if (strength < 2) return 'text-red';
    if (strength < 4) return 'text-yellow';
    return 'text-green';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const strength = passwordStrength(formData.password);

  return (

    <>
    <Navbar/>
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card-wrapper">
          {/* Header */}
          <div className="signup-header">
            <div className="signup-logo-wrapper">
              <CheckCircle className="signup-logo-icon" />
            </div>
            <h1 className="signup-title">Create your account</h1>
            <p className="signup-subtitle">Start your free 14-day trial today</p>
          </div>

          {/* Signup Form */}
          <div className="signup-form-card">
            <form onSubmit={handleSubmit} className="form-space-y-6">
              <div className="form-grid-cols-2">
                <div>
                  <label className="form-label">First Name</label>
                  <div className="input-with-icon">
                    <div className="input-icon-left">
                      <User className="input-icon" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="form-input-text-icon"
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="form-input-text"
                    placeholder="Last name"
                  />
                </div>
              </div>

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
                <label className="form-label">Company (Optional)</label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <Building className="input-icon" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input-text-icon"
                    placeholder="Company name"
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
                    placeholder="Create a password"
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
                {formData.password && (
                  <div className="password-strength-meter">
                    <div className="password-strength-bar-container">
                      <div
                        className={`password-strength-bar ${getStrengthColorClass(strength)}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`password-strength-text ${getStrengthTextColorClass(strength)}`}>
                      {getStrengthText(strength)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <div className="input-icon-left">
                    <Lock className="input-icon" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="form-input-password"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-button"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="input-icon-hover" />
                    ) : (
                      <Eye className="input-icon-hover" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="password-mismatch-error">Passwords do not match</p>
                )}
              </div>

              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="form-checkbox"
                  />
                  <label className="checkbox-label">
                    I agree to the{' '}
                    <Link to="/terms" className="link-text">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="link-text">Privacy Policy</Link>
                  </label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label className="checkbox-label">
                    Send me product updates and tips via email
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword}
                className="submit-button"
              >
                Create Account
              </button>
            </form>

            {/* Benefits */}
            <div className="benefits-section">
              <h4 className="benefits-title">What you get:</h4>
              <ul className="benefits-list">
                <li className="benefits-list-item">
                  <CheckCircle className="benefits-icon" />
                  14-day free trial
                </li>
                <li className="benefits-list-item">
                  <CheckCircle className="benefits-icon" />
                  No credit card required
                </li>
                <li className="benefits-list-item">
                  <CheckCircle className="benefits-icon" />
                  Full access to all features
                </li>
              </ul>
            </div>

            {/* Sign In Link */}
            <div className="signin-link-wrapper">
              <p className="signin-text">
                Already have an account?{' '}
                <Link to="/login" className="link-text-bold">
                  Sign in
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

export default Signup;