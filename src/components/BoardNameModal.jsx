

import React, { useState } from 'react';
import { X } from 'lucide-react';
import './BoardNameModal.css';

const BoardNameModal = ({ isOpen, onClose, template, onCreateBoard }) => {
  const [boardName, setBoardName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onCreateBoard(boardName.trim());
      setBoardName('');
      onClose();
    }
  };

  const handleClose = () => {
    setBoardName('');
    onClose();
  };

  if (!isOpen || !template) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Name Your Board</h2>
          <button onClick={handleClose} className="close-button" aria-label="Close">
            <X className="close-button-icon" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Board Preview */}
          <div
            className="board-preview"
            style={{ backgroundColor: template.color }}
          >
            {boardName || template.name}
          </div>

          {/* Board Name Input */}
          <div className="form-group">
            <label htmlFor="boardName" className="form-label">
              Board Name
            </label>
            <input
              type="text"
              id="boardName"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder={`Enter name for your ${template.name}...`}
              className="form-input"
              autoFocus
            />
          </div>

          {/* Template Info */}
          <div className="template-info">
            <h4 className="template-info-title">Template: {template.name}</h4>
            <p className="template-info-description">{template.description}</p>
            <div className="template-lists-container">
              {template.lists.map((list, index) => (
                <span key={index} className="template-list-item">
                  {list}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!boardName.trim()}
              className="btn btn-primary"
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardNameModal;