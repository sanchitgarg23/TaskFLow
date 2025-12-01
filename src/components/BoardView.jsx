import React, { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import "./BoardView.css"; // Import the new CSS file

const BoardView = ({ board, onUpdateBoard }) => {
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  const addNewList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/boards/${board.id}/lists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newListTitle.trim(),
            position: board.lists.length,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create list");
      const createdList = await res.json();

      const updatedBoard = {
        ...board,
        lists: [...board.lists, createdList],
      };

      onUpdateBoard(updatedBoard);
      setNewListTitle("");
      setIsAddingList(false);
    } catch (err) {
      console.error("Error creating list:", err);
      alert("Failed to create list");
    }
  };

  // add a new card
  const addCard = async (listId, cardTitle) => {
    if (!cardTitle.trim()) return;

    try {
      const targetList = board.lists.find(l => l.id === listId);
      const position = targetList?.cards?.length || 0;

      const res = await fetch(
        `http://localhost:5001/api/lists/${listId}/cards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: cardTitle.trim(),
            position: position,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create card");
      const createdCard = await res.json();

      const updatedBoard = {
        ...board,
        lists: board.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, createdCard] }
            : list
        ),
      };

      onUpdateBoard(updatedBoard);
    } catch (err) {
      console.error("Error creating card:", err);
      alert("Failed to create card");
    }
  };

  const updateList = async (listId, data) => {
    const res = await fetch(`http://localhost:5001/api/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update list");
    const updatedList = await res.json();

    const updatedBoard = {
      ...board,
      lists: board.lists.map((list) =>
        list.id === listId ? updatedList : list
      ),
    };
    onUpdateBoard(updatedBoard);
  };

  const deleteList = async (listId) => {
    const res = await fetch(`http://localhost:5001/api/lists/${listId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete list");

    const updatedBoard = {
      ...board,
      lists: board.lists.filter((list) => list.id !== listId),
    };
    onUpdateBoard(updatedBoard);
  };

  const updateCard = async (cardId, data) => {
    const res = await fetch(`http://localhost:5001/api/cards/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update card");
    const updatedCard = await res.json();

    const updatedBoard = {
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          card.id === cardId ? updatedCard : card
        ),
      })),
    };
    onUpdateBoard(updatedBoard);
  };

  const deleteCard = async (cardId) => {
    const res = await fetch(`http://localhost:5001/api/cards/${cardId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete card");

    const updatedBoard = {
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.filter((card) => card.id !== cardId),
      })),
    };
    onUpdateBoard(updatedBoard);
  };

  // rename the board
  const updateBoardName = async (newName) => {
    const res = await fetch(`http://localhost:5001/api/boards/${board.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) throw new Error("Failed to rename board");
    const updated = await res.json();
    onUpdateBoard(updated);
  };
  // delete the board
  const handleDeleteBoard = async () => {
    if (!window.confirm("Delete this board?")) return;
    const res = await fetch(`http://localhost:5001/api/boards/${board.id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete board");
    window.location.href = "/boards"; // or navigate('/boards') using useNavigate
  };

  // refresh the board
  const refreshBoard = async () => {
    const res = await fetch(`http://localhost:5001/api/boards/${board.id}`);
    if (!res.ok) throw new Error("Failed to fetch board");
    const freshBoard = await res.json();
    onUpdateBoard(freshBoard);
  };

  return (
    <div
      className="board-view-container"
      style={{ backgroundColor: board.color + "20" }}
    >
      <div className="board-view-content">
        {/* Board Header */}
        <div className="board-header">
          <h1 className="board-title">{board.name}</h1>
          <div className="board-header-actions">
            <button
              onClick={() => {
                const newName = prompt("Rename board", board.name);
                if (newName && newName.trim()) updateBoardName(newName.trim());
              }}
            >
              Rename
            </button>
            <button onClick={handleDeleteBoard}>Delete</button>
          </div>
        </div>

        {/* Lists Container */}
        <div className="lists-container">
          {/* Existing Lists */}
          {board.lists.map((list) => (
            <ListComponent
              key={list.id}
              list={list}
              onAddCard={(cardTitle) => addCard(list.id, cardTitle)}
              onUpdateList={updateList}
              onDeleteList={deleteList}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
            />
          ))}

          {/* Add New List */}
          <div className="list-wrapper">
            {isAddingList ? (
              <div className="add-form">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="add-item-input"
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && addNewList()}
                />
                <div className="add-item-actions">
                  <button
                    onClick={addNewList}
                    className="btn btn-sm btn-primary"
                  >
                    Add List
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                    className="btn btn-sm btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="add-list-button"
              >
                <Plus />
                <span className="add-list-button-text">Add another list</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ListComponent = ({
  list,
  onAddCard,
  onUpdateList,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
}) => {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const handleSaveTitle = () => {
    if (listTitle.trim() && listTitle !== list.title) {
      onUpdateList(list.id, { title: listTitle.trim() });
    }
    setIsEditingTitle(false);
  };
  
//  add a card use
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="list-wrapper">
      <div className="list-component">
        <div className="list-header">
          {isEditingTitle ? (
            <input
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              className="list-title-input"
              autoFocus
            />
          ) : (
            <h3 className="list-title">{list.title}</h3>
          )}

          <div className="list-actions">
            <button onClick={() => setIsEditingTitle(true)}>
              <MoreHorizontal />
            </button>
            <button
              onClick={() => onDeleteList(list.id)}
              className="list-delete-btn"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="cards-container">
          {list.cards.map((card) => (
            <div key={card.id} className="card-item">
              <p className="card-title">{card.title}</p>
              <div className="card-actions">
                <button
                  onClick={() => {
                    const newTitle = prompt("Edit card title", card.title);
                    if (newTitle && newTitle.trim())
                      onUpdateCard(card.id, { title: newTitle.trim() });
                  }}
                >
                  ✎
                </button>
                <button onClick={() => onDeleteCard(card.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Card */}
        {isAddingCard ? (
          <div className="add-card-form">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="add-item-input add-item-textarea"
              rows={3}
              autoFocus
            />
            <div className="add-item-actions">
              <button
                onClick={handleAddCard}
                className="btn btn-sm btn-primary"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="add-card-button"
          >
            <Plus />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardView;
