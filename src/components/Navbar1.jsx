


import React, { useState } from 'react';
import { Search, Plus, User, Home, CheckCircle, LogOut, Settings, ChevronDown } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import BoardNameModal from './BoardNameModal';
import './Navbar1.css'; // Import the CSS file
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ 
  onCreateBoard, 
  onNavigateHome, 
  showHomeButton = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    setIsNameModalOpen(true);
  };

  function hi() {
    navigate("/homepage");
  }

  const handleCreateBoard = (name) => {
    if (selectedTemplate && onCreateBoard) {
      onCreateBoard(name, selectedTemplate);
    }
    setIsNameModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Navigate to boards page with search query
      navigate(`/boards?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="navbar1-container">
        <div className="navbar1-wrapper">
          <div className="navbar1-content">
            {/* Left section - Logo/Brand */}
            <div className="navbar1-left">
              <div className="navbar1-brand">
                <div className="navbar1-logo-wrapper">
                  <CheckCircle className="navbar1-logo-icon" />
                </div>
                <span className="navbar1-logo-text">
                  TaskFlow
                </span>
              </div>

              {/* Home Button (shown on board pages) */}
              {showHomeButton && onNavigateHome && (
                <button
                  onClick={hi}
                  className="navbar1-home-button"
                >
                  <Home className="navbar1-home-icon" />
                  <span className="navbar1-home-text">Home</span>
                </button>
              )}
            </div>

            {/* Center section - Search Bar */}
            <div className="navbar1-search-container">
              <div className="navbar1-search-wrapper">
                <div className="navbar1-search-icon-wrapper">
                  <Search className="navbar1-search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search boards, cards..."
                  className="navbar1-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>

            {/* Right section - Actions and Profile */}
            <div className="navbar1-right">
              {/* Create Button */}
              <button 
                onClick={() => setIsTemplateModalOpen(true)}
                className="navbar1-create-button"
                data-create-button
              >
                <Plus className="navbar1-create-icon" />
                Create
              </button>

              {/* Profile Button */}
              {/* Profile Dropdown */}
              <div className="navbar1-profile-container">
                <button 
                  className="navbar1-profile-button" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="navbar1-profile-avatar">
                    {user.firstName ? user.firstName[0].toUpperCase() : <User className="navbar1-profile-icon" />}
                  </div>
                  <ChevronDown className={`navbar1-chevron ${isProfileOpen ? 'open' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="navbar1-dropdown-menu">
                    <div className="navbar1-dropdown-header">
                      <p className="navbar1-user-name">{user.firstName} {user.lastName}</p>
                      <p className="navbar1-user-email">{user.email}</p>
                    </div>
                    <div className="navbar1-dropdown-divider" />
                    <button className="navbar1-dropdown-item">
                      <Settings className="navbar1-dropdown-icon" />
                      Settings
                    </button>
                    <button onClick={handleLogout} className="navbar1-dropdown-item logout">
                      <LogOut className="navbar1-dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Template Selection Modal */}
      <TemplateSelector
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Board Name Modal */}
      <BoardNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        template={selectedTemplate}
        onCreateBoard={handleCreateBoard}
      />
    </>
  );
};

export default Navbar;