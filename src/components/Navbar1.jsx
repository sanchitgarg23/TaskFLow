


import React, { useState } from 'react';
import { Search, Plus, User, Home, CheckCircle } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import BoardNameModal from './BoardNameModal';
import './Navbar1.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Navbar = ({ 
  onCreateBoard, 
  onNavigateHome, 
  showHomeButton = false 
}) => {
  const navigate = useNavigate();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    setIsNameModalOpen(true);
  };

  function hi() {
    navigate("/homepage")
  }

  const handleCreateBoard = (name) => {
    if (selectedTemplate && onCreateBoard) {
      onCreateBoard(name, selectedTemplate);
    }
    setIsNameModalOpen(false);
    setSelectedTemplate(null);
  };

  function home() {
    navigate("/")
  }

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
                  placeholder="Search boards, cards, and more..."
                  className="navbar1-search-input"
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
              <button className="navbar1-profile-button" onClick={home}>
                <User className="navbar1-profile-icon" />
              </button>
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