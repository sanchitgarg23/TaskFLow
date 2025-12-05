
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckCircle } from 'lucide-react';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand-wrapper">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <CheckCircle className="navbar-logo-icon" />
            </div>
            <span className="navbar-title">TaskFlow</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links-desktop">
          <div className="navbar-links-group">
            <Link
              to="/features"
              className={`navbar-link ${isActive('/features') ? 'navbar-link-active' : ''}`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`navbar-link ${isActive('/pricing') ? 'navbar-link-active' : ''}`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`navbar-link ${isActive('/about') ? 'navbar-link-active' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`navbar-link ${isActive('/contact') ? 'navbar-link-active' : ''}`}
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="navbar-auth-desktop">
          <Link to="/login" className="navbar-login-btn">
            Log In
          </Link>
          <Link to="/signup" className="navbar-signup-btn">
            Sign Up Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="navbar-menu-button-mobile">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="navbar-menu-icon-btn"
          >
            {isMenuOpen ? <X className="navbar-menu-icon" /> : <Menu className="navbar-menu-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links-group">
            <Link
              to="/features"
              className={`navbar-mobile-link ${isActive('/features') ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`navbar-mobile-link ${isActive('/pricing') ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`navbar-mobile-link ${isActive('/about') ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`navbar-mobile-link ${isActive('/contact') ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="navbar-mobile-auth-section">
              <Link
                to="/login"
                className="navbar-mobile-login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="navbar-mobile-signup-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;