import React from 'react';
import { Calendar, Clock, MapPin, Edit3 } from 'lucide-react';

export default function EventFlow() {
  const schedule = [
    { time: '09:00 AM', title: 'Registration & Breakfast', location: 'Main Hall', status: 'completed' },
    { time: '10:00 AM', title: 'Inauguration Ceremony', location: 'Auditorium', status: 'completed' },
    { time: '11:00 AM', title: 'Ideathon Commences', location: 'Innovation Labs', status: 'active' },
    { time: '01:30 PM', title: 'Lunch Break', location: 'Cafeteria', status: 'upcoming' },
    { time: '04:00 PM', title: 'Mentorship Session 1', location: 'Innovation Labs', status: 'upcoming' },
    { time: '07:00 PM', title: 'Initial Pitch Review', location: 'Conference Room B', status: 'upcoming' }
  ];

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="text-gradient">Event Flow</h1>
          <p>Manage and track the schedule for the Ideathon.</p>
        </div>
        <button className="btn btn-primary">
          <Edit3 size={18} /> Edit Schedule
        </button>
      </header>

      <div className="card mt-4">
        <h2 className="section-title">Day 1 Timeline</h2>
        
        <div style={{marginTop: '24px'}}>
          {schedule.map((item, index) => (
            <div key={index} style={{
              display: 'flex', 
              gap: '24px', 
              marginBottom: '24px',
              opacity: item.status === 'completed' ? 0.6 : 1
            }}>
              <div style={{
                width: '120px', 
                color: item.status === 'active' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: item.status === 'active' ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={16} />
                {item.time}
              </div>
              
              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: item.status === 'active' ? 'var(--accent-primary)' : 
                             item.status === 'completed' ? 'var(--status-success)' : 'var(--surface-color-light)',
                  border: `2px solid ${item.status === 'active' ? 'var(--accent-primary)' : 
                                      item.status === 'completed' ? 'var(--status-success)' : 'var(--border-color)'}`,
                  zIndex: 2,
                  boxShadow: item.status === 'active' ? '0 0 10px var(--accent-primary)' : 'none'
                }}></div>
                {index < schedule.length - 1 && (
                  <div style={{
                    width: '2px',
                    height: '100%',
                    background: item.status === 'completed' ? 'var(--status-success)' : 'var(--border-color)',
                    position: 'absolute',
                    top: '16px',
                    zIndex: 1
                  }}></div>
                )}
              </div>
              
              <div style={{
                flex: 1, 
                background: item.status === 'active' ? 'rgba(251, 200, 21, 0.1)' : 'transparent',
                padding: '16px',
                borderRadius: '8px',
                border: item.status === 'active' ? '1px solid rgba(251, 200, 21, 0.3)' : '1px solid transparent',
                marginTop: '-12px'
              }}>
                <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem', color: item.status === 'active' ? 'var(--text-primary)' : 'var(--text-primary)'}}>
                  {item.title}
                </h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  <MapPin size={14} /> {item.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
