
import React, { createContext, useContext, useState } from 'react';
import { boardTemplates } from '../data/templates'; // i might need this if used somewhere

const BoardContext = createContext();  

export const useBoards = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  // here i create a new use state for loading
  const [loading, setLoading] = useState(true);

  const fetchBoards = async (sortBy = 'created', order = 'desc', search = '', filterTemplate = 'all', page = 1) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      
      // Build query parameters
      const params = new URLSearchParams({
        userId: user.id,
        sortBy,
        order,
        page: page.toString(),
        limit: '12'
      });

      // Add search if provided
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      // Add filter if not 'all'
      if (filterTemplate && filterTemplate !== 'all') {
        params.append('filterTemplate', filterTemplate);
      }

      const res = await fetch(
        `http://localhost:5001/api/boards?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch boards");
      
      const data = await res.json();
      setBoards(data.boards);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async (name, template) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User not found");
      const user = JSON.parse(userStr);

      const res = await fetch("http://localhost:5001/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: template.name,
          color: template.color, 
          userId: user.id
        }),
      });

      if (!res.ok) throw new Error("Failed to create board");

      const newBoard = await res.json();
      setBoards(prev => [newBoard, ...prev]);
      return newBoard;
    } catch (err) {
      console.error("Error creating board:", err);
      throw err;
    }
  };

  const updateBoard = (updatedBoard) => {
    setBoards(prev => prev.map(board =>
      board.id === updatedBoard.id ? updatedBoard : board
    ));
  };

  const getBoardById = (id) => {
    return boards.find(board => board.id === parseInt(id));
  };

  const deleteBoard = async (boardId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete board");

      // Remove board from state
      setBoards(prev => prev.filter(board => board.id !== boardId));
      return true;
    } catch (err) {
      console.error("Error deleting board:", err);
      throw err;
    }
  };

  const renameBoard = async (boardId, newName) => {
    try {
      const res = await fetch(`http://localhost:5001/api/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("Failed to rename board");

      const updatedBoard = await res.json();
      
      // Update board in state
      setBoards(prev => prev.map(board =>
        board.id === boardId ? updatedBoard : board
      ));
      return updatedBoard;
    } catch (err) {
      console.error("Error renaming board:", err);
      throw err;
    }
  };

  return (
    <BoardContext.Provider value={{
      boards,
      pagination,
      loading,
      createBoard,
      updateBoard,
      getBoardById,
      fetchBoards,
      deleteBoard,
      renameBoard
    }}>
      {children}
    </BoardContext.Provider>
  );
};
