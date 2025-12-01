
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar1 from '../components/Navbar1';
import BoardSidebar from '../components/BoardSidebar';
import BoardView from '../components/BoardView';
import { useBoards } from '../context/BoardContext';

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { boards, createBoard, updateBoard, getBoardById, loading, fetchBoards } = useBoards();

  const currentBoard = boardId ? getBoardById(boardId) : undefined;

  // Refetch boards if current board is not found (handles deep links or sync issues)
  React.useEffect(() => {
    if (!loading && !currentBoard && boardId) {
      fetchBoards();
    }
  }, [loading, currentBoard, boardId, fetchBoards]);

  const handleCreateBoard = async (name, template) => {
    const newBoard = await createBoard(name, template);
    navigate(`/board/${newBoard.id}`);
  };

  const handleSelectBoard = (selectedBoardId) => {
    navigate(`/board/${selectedBoardId}`);
  };

  const handleNavigateHome = () => {
    navigate('/homepage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Board Not Found</h2>
          <button
            onClick={handleNavigateHome}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar1 
        onCreateBoard={handleCreateBoard}
        onNavigateHome={handleNavigateHome}
        showHomeButton={true}
      />
      <div className="flex flex-1 overflow-hidden">
        <BoardSidebar
          boards={boards}
          currentBoardId={boardId}
          onSelectBoard={handleSelectBoard}
        />
        <BoardView
          board={currentBoard}
          onUpdateBoard={updateBoard}
        />
      </div>
    </div>
  );
};

export default BoardPage;
