
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Calendar } from 'lucide-react';
import Navbar1 from '../components/Navbar1';
import { useBoards } from '../context/BoardContext';
import './HomePage.css'; // Import your custom CSS file

const HomePage = () => {
  const navigate = useNavigate();
  const { boards, createBoard } = useBoards();

  const handleCreateBoard = async (name, template) => {
    const newBoard = await createBoard(name, template);
    navigate(`/board/${newBoard.id}`);
  };

  const handleSelectBoard = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const handleNavigateToTeamCollaboration = () => {
    navigate('/team');
  };

  const handleNavigateToCalendar = () => {
    navigate('/calendar');
  };

  const handleNavigateToBrowseBoards = () => {
    navigate('/boards');
  };

  return (
    <div className="homepage-container">
      <Navbar1 onCreateBoard={handleCreateBoard} />

      <main className="homepage-main">
        <div className="homepage-center">
          <h1 className="homepage-title">Welcome to TaskFlow</h1>
          <p className="homepage-subtitle">Organize your projects and boost productivity</p>

          {boards.length > 0 && (
            <div className="recent-boards">
              <div className="recent-boards-header">
                <h2 className="recent-boards-title">Recent Boards</h2>
                <button onClick={handleNavigateToBrowseBoards} className="view-all-link">
                  View All Boards →
                </button>
              </div>
              <div className="boards-grid">
                {boards.slice(-8).map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSelectBoard(board.id)}
                    className="board-card"
                  >
                    <div
                      className="board-preview"
                      style={{ backgroundColor: board.color }}
                    >
                      {board.name}
                    </div>
                    <h3 className="board-name">{board.name}</h3>
                    <p className="board-template">
                      {(board.type || "Kanban").replace('-', ' ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quick-actions">
            <button
              onClick={() => document.querySelector('[data-create-button]')?.click()}
              className="action-card"
            >
              <div className="action-icon blue-bg">
                <Plus className="icon" />
              </div>
              <h3 className="action-title">Create Board</h3>
              <p className="action-desc">Start organizing your tasks with a new board</p>
            </button>

            <button onClick={handleNavigateToBrowseBoards} className="action-card">
              <div className="action-icon indigo-bg">
                <Search className="icon" />
              </div>
              <h3 className="action-title">Browse Boards</h3>
              <p className="action-desc">Find and access your existing project boards</p>
            </button>

            <button onClick={handleNavigateToTeamCollaboration} className="action-card">
              <div className="action-icon purple-bg">
                <User className="icon" />
              </div>
              <h3 className="action-title">Team Collaboration</h3>
              <p className="action-desc">Invite team members and work together</p>
            </button>

            <button onClick={handleNavigateToCalendar} className="action-card">
              <div className="action-icon green-bg">
                <Calendar className="icon" />
              </div>
              <h3 className="action-title">Calendar</h3>
              <p className="action-desc">Schedule events and manage your time</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
