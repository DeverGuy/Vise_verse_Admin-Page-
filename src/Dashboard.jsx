import React from 'react';
import { Users, Gavel, CalendarCheck, Zap } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="text-gradient">Ideathon Dashboard</h1>
          <p>Welcome to the central command center for the IVC × InUnity Ideathon.</p>
        </div>
        <button className="btn btn-primary">
          <Zap size={18} /> Quick Action
        </button>
      </header>

      <div className="stats-grid mt-4">
        <div className="card stat-card animate-fade-in animate-delay-1">
          <div className="stat-icon-wrapper" style={{background: 'rgba(251, 200, 21, 0.1)', color: 'var(--accent-primary)'}}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>240</h3>
            <p>Total Participants</p>
          </div>
        </div>

        <div className="card stat-card animate-fade-in animate-delay-2">
          <div className="stat-icon-wrapper" style={{background: 'rgba(255, 0, 127, 0.1)', color: 'var(--accent-secondary)'}}>
            <Gavel size={24} />
          </div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Active Judges</p>
          </div>
        </div>

        <div className="card stat-card animate-fade-in animate-delay-3">
          <div className="stat-icon-wrapper" style={{background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-tertiary)'}}>
            <CalendarCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>Day 1</h3>
            <p>Current Event Stage</p>
          </div>
        </div>
      </div>

      <div className="recent-activity-section mt-8 animate-fade-in animate-delay-3">
        <h2 className="section-title">Recent Activity</h2>
        <div className="glass-panel" style={{padding: '0'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:00 AM</td>
                <td>Team Alpha submitted prototype</td>
                <td><span className="badge badge-success">Reviewed</span></td>
              </tr>
              <tr>
                <td>09:45 AM</td>
                <td>Judge 'Dr. Smith' logged in</td>
                <td><span className="badge badge-neutral">Log</span></td>
              </tr>
              <tr>
                <td>09:15 AM</td>
                <td>Team Beta requested mentor assistance</td>
                <td><span className="badge badge-warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
