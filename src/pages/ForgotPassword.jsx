
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Login.css'; // Reuse Login styles

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate backend call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Navbar />
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
              <h1 className="login-title">Reset password</h1>
              <p className="login-subtitle">
                {!submitted 
                  ? "Enter your email for instructions"
                  : "Check your email for instructions"
                }
              </p>
            </div>

            <div className="login-form-card">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="form-space-y-6">
                  <div>
                    <label className="form-label">Email</label>
                    <div className="input-with-icon">
                      <div className="input-icon-left">
                        <Mail className="input-icon" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input-text-icon"
                        placeholder="Enter your email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <div className="text-center mt-4">
                    <Link to="/login" className="link-text-sm flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 text-sm">
                    We have sent a password reset link to <strong>{email}</strong>.
                    Please check your inbox (and spam folder) to proceed.
                  </div>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="submit-button bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Back to Login
                  </button>
                  
                  <p className="mt-4 text-xs text-gray-500">
                    Did not receive the email? <button onClick={() => setSubmitted(false)} className="text-blue-600 hover:underline">Try again</button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
