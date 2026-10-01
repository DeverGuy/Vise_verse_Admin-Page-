import React from 'react';
import { Search, Filter, UserPlus, FileText, CheckCircle } from 'lucide-react';

export default function ParticipantsPortal() {
  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="text-gradient">Participants Portal</h1>
          <p>Monitor participant teams, submissions, and status.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} /> Register Team
        </button>
      </header>

      <div className="stats-grid mt-4">
        <div className="card">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px'}}>Total Teams</div>
          <div style={{fontSize: '2rem', fontWeight: 'bold'}}>48</div>
        </div>
        <div className="card">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px'}}>Submissions</div>
          <div style={{fontSize: '2rem', fontWeight: 'bold'}}>32</div>
        </div>
        <div className="card">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px'}}>Pending Review</div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-warning)'}}>16</div>
        </div>
      </div>

      <div className="glass-panel mt-8" style={{padding: 0}}>
        <div style={{padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between'}}>
          <div style={{position: 'relative', width: '300px'}}>
            <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
            <input 
              type="text" 
              placeholder="Search teams..." 
              style={{
                background: 'var(--bg-color)', 
                border: '1px solid var(--border-color)', 
                padding: '10px 10px 10px 40px', 
                borderRadius: '8px', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family)',
                width: '100%'
              }} 
            />
          </div>
          <button className="btn btn-outline"><Filter size={18} /> Filters</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Theme</th>
              <th>Members</th>
              <th>Submission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{fontWeight: '600'}}>Team Alpha</td>
              <td>Smart Campus</td>
              <td>4</td>
              <td><span style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)'}}><FileText size={16} /> prototype_v1.zip</span></td>
              <td><span className="badge badge-success">Reviewed</span></td>
            </tr>
            <tr>
              <td style={{fontWeight: '600'}}>Innovators HQ</td>
              <td>Healthcare Tech</td>
              <td>3</td>
              <td><span style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)'}}>No submission yet</span></td>
              <td><span className="badge badge-neutral">Ideation</span></td>
            </tr>
            <tr>
              <td style={{fontWeight: '600'}}>Byte Me</td>
              <td>Sustainability</td>
              <td>5</td>
              <td><span style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)'}}><FileText size={16} /> final_pitch.pdf</span></td>
              <td><span className="badge badge-warning">Pending Review</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
