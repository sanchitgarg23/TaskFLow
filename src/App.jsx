

import React from 'react';
// import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import BrowseBoardsPage from './pages/BrowseBoardsPage';
import TeamCollaborationPage from './pages/TeamCollaborationPage';
import TeamBoardCreationPage from './pages/TeamBoardCreationPage';
import CalendarPage from './pages/CalendarPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import { TeamProvider } from './context/TeamContext';
import { CalendarProvider } from './context/CalendarContext';
function App() {
  return (
    <>
    <Router>
      <BoardProvider>
        <TeamProvider>
          <CalendarProvider>
            <div className="min-h-screen bg-white">
            {/* <Navbar /> */}
            <Routes>
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/boards" element={<BrowseBoardsPage />} />
              <Route path="/board/:boardId" element={<BoardPage />} />
              <Route path="/team" element={<TeamCollaborationPage />} />
              <Route path="/team/create-board" element={<TeamBoardCreationPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
              <Footer />
             </div>
          </CalendarProvider>
        </TeamProvider>
      </BoardProvider>
    </Router>

    </>
  );
}

export default App;