import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import MeetingRoom from './pages/MeetingRoom';

// Meeting App Version: 1.0.1 - Triggering fresh deploy
function App() {
  return (
    <Router basename="/MEET-MVP">
      <div className="min-h-screen bg-dark-bg text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:roomId" element={<MeetingRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
