
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, Plus, Calendar, Users, Star, Archive, MoreHorizontal, Trash2, Edit3, Copy } from 'lucide-react';
import Navbar1 from '../components/Navbar1';
import { useBoards } from '../context/BoardContext';

const BrowseBoardsPage = () => {
  const navigate = useNavigate();
  const { boards, pagination, createBoard, fetchBoards, deleteBoard, renameBoard } = useBoards();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);



  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page
    fetchBoards(newSortBy, 'desc', searchQuery, filterTemplate, 1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    fetchBoards(sortBy, 'desc', query, filterTemplate, 1);
  };

  const handleFilterChange = (template) => {
    setFilterTemplate(template);
    setCurrentPage(1); // Reset to first page
    fetchBoards(sortBy, 'desc', searchQuery, template, 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchBoards(sortBy, 'desc', searchQuery, filterTemplate, newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateBoard = async (name, template) => {
    const newBoard = await createBoard(name, template);
    navigate(`/board/${newBoard.id}`);
  };

  const handleNavigateHome = () => {
    navigate('/homepage');
  };

  const handleSelectBoard = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const toggleBoardSelection = (boardId) => {
    setSelectedBoards(prev =>
      prev.includes(boardId)
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleDeleteBoard = async (boardId, boardName) => {
    if (window.confirm(`Are you sure you want to delete "${boardName}"? This action cannot be undone.`)) {
      try {
        await deleteBoard(boardId);
        // Optionally show success message
      } catch (err) {
        alert("Failed to delete board. Please try again.");
      }
    }
  };

  const handleRenameBoard = async (boardId, currentName) => {
    const newName = prompt("Enter new board name:", currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      try {
        await renameBoard(boardId, newName.trim());
        // Optionally show success message
      } catch (err) {
        alert("Failed to rename board. Please try again.");
      }
    }
  };

  // No need for frontend filtering - backend handles it now
  const filteredAndSortedBoards = boards;

  const getTemplateDisplayName = (template) => {
    return template.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTemplateColor = (template) => {
    const colors = {
      'kanban': '#3B82F6',
      'project-management': '#8B5CF6',
      'sprint-planning': '#10B981',
      'content-calendar': '#F59E0B',
      'bug-tracking': '#EF4444',
      'personal-tasks': '#EC4899'
    };
    return colors[template] || '#6B7280';
  };

  const BoardCard = ({ board }) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Board Preview */}
      <div
        className="h-32 flex items-center justify-center text-white font-semibold text-lg cursor-pointer"
        style={{ backgroundColor: board.color }}
        onClick={() => handleSelectBoard(board.id)}
      >
        {board.name}
      </div>

      {/* Board Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors flex-1"
            onClick={() => handleSelectBoard(board.id)}
          >
            {board.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className="h-4 w-4" />
            </button>
            <div className="relative">
              <button 
                onClick={() => handleRenameBoard(board.id, board.name)}
                className="p-1 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit board"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDeleteBoard(board.id, board.name)}
                className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete board"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
            {getTemplateDisplayName(board.type || "Kanban")}
          </span>
          <span>{board.lists.length} lists</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{board.lists.reduce((acc, list) => acc + list.cards.length, 0)} cards</span>
          </div>
        </div>
      </div>
    </div>
  );

  const BoardListItem = ({ board }) => (
    <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 p-4">
      <div className="flex items-center space-x-4">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={selectedBoards.includes(board.id)}
          onChange={() => toggleBoardSelection(board.id)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />

        {/* Board Color Indicator */}
        <div
          className="w-8 h-8 rounded flex-shrink-0"
          style={{ backgroundColor: board.color }}
        />

        {/* Board Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleSelectBoard(board.id)}
            >
              {board.name}
            </h3>
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {getTemplateDisplayName(board.type || "Kanban")}
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <span>{board.lists.length} lists</span>
            <span>{board.lists.reduce((acc, list) => acc + list.cards.length, 0)} cards</span>
            <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Star className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleRenameBoard(board.id, board.name)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteBoard(board.id, board.name)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1
        onCreateBoard={handleCreateBoard}
        onNavigateHome={handleNavigateHome}
        showHomeButton={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Boards</h1>
            <p className="text-gray-600 mt-1">
              {boards.length} {boards.length === 1 ? 'board' : 'boards'} total
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search boards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={filterTemplate}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Templates</option>
                <option value="Kanban Board">Kanban Board</option>
                <option value="Kanban">Kanban</option>
                <option value="Project Management">Project Management</option>
                <option value="Sprint Planning">Sprint Planning</option>
                <option value="Content Calendar">Content Calendar</option>
                <option value="Bug Tracking">Bug Tracking</option>
                <option value="Personal Tasks">Personal Tasks</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg..."
              >
                <option value="created">Sort by Created</option>
                <option value="name">Sort by Name</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBoards.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedBoards.length} board{selectedBoards.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Archive
                  </button>
                  <button className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boards Display */}
        {filteredAndSortedBoards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterTemplate !== 'all' ? 'No boards found' : 'No boards yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterTemplate !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first board to get started'
              }
            </p>
            {!searchQuery && filterTemplate === 'all' && (
              <button
                onClick={() => document.querySelector('[data-create-button]')?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Board
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedBoards.map((board) => (
                  <BoardListItem key={board.id} board={board} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} boards
                </div>

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      pagination.hasPrevPage
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                        
                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                page === currentPage
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      pagination.hasNextPage
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBoardsPage;
