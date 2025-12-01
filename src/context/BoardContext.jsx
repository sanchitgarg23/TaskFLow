
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

  // here i create a new use state for loading
  const [loading, setLoading] = useState(true);

  const fetchBoards = async (sortBy = 'created', order = 'desc') => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      
      const res = await fetch(
      `http://localhost:5001/api/boards?userId=${user.id}&sortBy=${sortBy}&order=${order}`
    );
      if (!res.ok) throw new Error("Failed to fetch boards");
      
      const data = await res.json();
      setBoards(data);
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

  return (
    <BoardContext.Provider value={{
      boards,
      loading,
      createBoard,
      updateBoard,
      getBoardById,
      fetchBoards
    }}>
      {children}
    </BoardContext.Provider>
  );
};
