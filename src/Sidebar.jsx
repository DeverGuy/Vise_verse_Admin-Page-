import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Gavel, Calendar, Code, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Code className="logo-icon" size={28} />
          <div>
            <h2 className="logo-text">Ideathon Admin</h2>
            <p className="logo-subtext">IVC × InUnity</p>
          </div>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <p className="nav-label">Main Menu</p>
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/judges" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Gavel size={20} />
          <span>Judges Portal</span>
        </NavLink>
        <NavLink to="/participants" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Participants Portal</span>
        </NavLink>
        <NavLink to="/event-flow" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Event Flow</span>
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <p className="college-name">Vidyavardhaka College of Engineering</p>
        <button className="btn btn-outline w-full mt-4" style={{ justifyContent: 'center' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
