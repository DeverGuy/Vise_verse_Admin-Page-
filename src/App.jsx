import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import JudgesPortal from './JudgesPortal';
import ParticipantsPortal from './ParticipantsPortal';
import EventFlow from './EventFlow';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/judges" element={<JudgesPortal />} />
            <Route path="/participants" element={<ParticipantsPortal />} />
            <Route path="/event-flow" element={<EventFlow />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
