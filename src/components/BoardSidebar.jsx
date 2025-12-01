import React from 'react';
import { Calendar, Users } from 'lucide-react';
import './BoardSidebar.css'; // Import the stylesheet

const BoardSidebar = ({ boards, currentBoardId, onSelectBoard }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Your Boards</h2>
        
        {boards.length === 0 ? (
          <div className="empty-state-container">
            <div className="empty-state-icon">
              <Calendar />
            </div>
            <p className="empty-state-text">No boards yet</p>
            <p className="empty-state-subtext">Create your first board to get started</p>
          </div>
        ) : (
          <div className="boards-list">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                className={`board-item ${
                  currentBoardId === board.id ? 'active' : ''
                }`}
              >
                <div className="board-item-content">
                  <div
                    className="board-item-color-swatch"
                    style={{ backgroundColor: board.color }}
                  />
                  <div className="board-item-details">
                    <h3 className="board-item-name">
                      {board.name}
                    </h3>
                    <p className="board-item-meta">
                      {(board.type || "Kanban").replace('-', ' ')} • {board.lists?.length || 0} lists
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {boards.length > 0 && (
          <div className="sidebar-stats">
            <div className="stats-container">
              <div className="stat-item">
                <Calendar />
                <span>{boards.length} boards</span>
              </div>
              <div className="stat-item">
                <Users />
                <span>Personal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardSidebar;