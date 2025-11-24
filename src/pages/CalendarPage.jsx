

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CalendarPage.css"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import Navbar1 from '../components/Navbar1';
import CalendarGrid from '../components/CalendarGrid';
import EventModal from '../components/EventModal';
import EventSidebar from '../components/EventSidebar';
import { useCalendar } from '../context/CalendarContext';
import { useBoards } from '../context/BoardContext';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { events, createEvent, updateEvent, deleteEvent, getEventsByDate,fetchEventsByType } = useCalendar();
  const { createBoard } = useBoards();

// currentView stores the current calendar view type (month, week, or day) and the date the view is focused on. Defaults to the current date and month view
  const [currentView, setCurrentView] = useState({
    type: 'month',
    date: new Date()
  });

  // selectedDate tracks if the user has clicked a specific date on the calender
  const [selectedDate, setSelectedDate] = useState(null);

  // isEventModalOpen controls whether the modal to create/edit events is visible.
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

// editingEvent tracks which event is being edited if in edit mode.
  const [editingEvent, setEditingEvent] = useState(null);

  // searchQuery holds the current text to filter events by title/description.
  const [searchQuery, setSearchQuery] = useState('');

  // filterType limits events shown by type (like meetings, tasks, reminders, etc.).
  const [filterType, setFilterType] = useState('all');

  const handleCreateBoard = (name, template) => {
    const newBoard = createBoard(name, template);
    navigate(`/board/${newBoard.id}`);
  };

  const handleNavigateHome = () => {
    navigate('/homepage');
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentView.date);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentView({ ...currentView, date: newDate });
  };

  const goToToday = () => {
    setCurrentView({ ...currentView, date: new Date() });
  };
// clikc the date when we select it
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
// helpst to create the event
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // this will help to edit the event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };
// help to save the event 
  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // will check if data is there then only it will create
      updateEvent(editingEvent.id, eventData);
    } else {
      createEvent(eventData);
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };
// helps to delete the event
  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };


// this will be removed later when we will be using the backend filtering
  // const filteredEvents = events.filter(event => {
  //   if (!event || !event.title) return false;
  //   const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                         (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
  //   const matchesFilter = filterType === 'all' || event.type === filterType;
  //   return matchesSearch && matchesFilter;
  // });

  const todayEvents = getEventsByDate(new Date());
  const selectedDateEvents = selectedDate ? getEventsByDate(selectedDate) : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



  // this is for filtering the events by type like deadline , task , etc.

  const handleFilterChange = async (newFilterType) => {
    setFilterType(newFilterType);
    
    // Fetch events from backend based on filter
    if (newFilterType !== filterType) {
      await fetchEventsByType(newFilterType);
    }
  };

  return (
    <div className="calendar-page-container">
      <Navbar1
        onCreateBoard={handleCreateBoard}
        onNavigateHome={handleNavigateHome}
        showHomeButton={true}
      />

      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="header-title-group">
              <div className="header-icon-container">
                <Calendar className="header-icon" />
              </div>
              <h1 className="page-title">Calendar</h1>
            </div>
            
            {/* View Controls */}
            <div className="view-controls">
              <button
                onClick={() => setCurrentView({ ...currentView, type: 'month' })}
                className={`view-control-button ${currentView.type === 'month' ? 'active' : ''}`}
              >
                Month
              </button>
              <button
                onClick={() => setCurrentView({ ...currentView, type: 'week' })}
                className={`view-control-button ${currentView.type === 'week' ? 'active' : ''}`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView({ ...currentView, type: 'day' })}
                className={`view-control-button ${currentView.type === 'day' ? 'active' : ''}`}
              >
                Day
              </button>
            </div>
          </div>

          <div>
            <button onClick={handleCreateEvent} className="new-event-button">
              <Plus className="new-event-button-icon" />
              New Event
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="calendar-navigation">
          <div className="calendar-nav-left">
            <div className="month-navigation">
              <button onClick={() => navigateMonth('prev')} className="month-nav-button">
                <ChevronLeft className="month-nav-icon" />
              </button>
              <h2 className="month-display">
                {monthNames[currentView.date.getMonth()]} {currentView.date.getFullYear()}
              </h2>
              <button onClick={() => navigateMonth('next')} className="month-nav-button">
                <ChevronRight className="month-nav-icon" />
              </button>
            </div>
            
            <button onClick={goToToday} className="today-button">
              Today
            </button>
          </div>

          {/* Search and Filter */}
          <div className="calendar-nav-right">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="search-input"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Events</option>
              <option value="meeting">Meetings</option>
              <option value="deadline">Deadlines</option>
              <option value="task">Tasks</option>
              <option value="reminder">Reminders</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="calendar-grid-container">
            <CalendarGrid
              view={currentView}
              // events={filteredEvents} now we will be using the backend filtering
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEditEvent}
              selectedDate={selectedDate}
            />
          </div>

          <div className="sidebar-container">
            <EventSidebar
              todayEvents={todayEvents}
              selectedDateEvents={selectedDateEvents}
              selectedDate={selectedDate}
              onEventClick={handleEditEvent}
              onCreateEvent={handleCreateEvent}
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : undefined}
        event={editingEvent}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
