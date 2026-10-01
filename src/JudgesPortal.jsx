import React from 'react';
import { Search, Plus, UserPlus, Edit3, Trash2 } from 'lucide-react';

export default function JudgesPortal() {
  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="text-gradient">Judges Control Portal</h1>
          <p>Manage judging panels, scorecards, and evaluations.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Judge
        </button>
      </header>

      <div className="card mt-4" style={{display: 'flex', justifyContent: 'space-between', padding: '16px 24px'}}>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <div style={{position: 'relative'}}>
            <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
            <input 
              type="text" 
              placeholder="Search judges..." 
              style={{
                background: 'var(--bg-color)', 
                border: '1px solid var(--border-color)', 
                padding: '10px 10px 10px 40px', 
                borderRadius: '8px', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family)',
                width: '300px'
              }} 
            />
          </div>
          <button className="btn btn-outline">Filter</button>
        </div>
      </div>

      <div className="glass-panel mt-4" style={{padding: 0}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Judge Name</th>
              <th>Specialization</th>
              <th>Teams Assigned</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '4px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000'}}>
                    DS
                  </div>
                  <div>
                    <div style={{fontWeight: '500'}}>Dr. Smith</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>dr.smith@example.com</div>
                  </div>
                </div>
              </td>
              <td>AI & Machine Learning</td>
              <td>5 / 5</td>
              <td><span className="badge badge-success">Online</span></td>
              <td>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button className="btn btn-outline" style={{padding: '6px'}} title="Add/Assign"><UserPlus size={16} /></button>
                  <button className="btn btn-outline" style={{padding: '6px'}} title="Edit Details"><Edit3 size={16} /></button>
                  <button className="btn btn-outline" style={{padding: '6px', color: 'var(--status-error)', borderColor: 'var(--status-error)'}} title="Delete"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '4px', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000'}}>
                    JW
                  </div>
                  <div>
                    <div style={{fontWeight: '500'}}>Jane Williams</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>jane.w@example.com</div>
                  </div>
                </div>
              </td>
              <td>Web3 & Blockchain</td>
              <td>2 / 5</td>
              <td><span className="badge badge-warning">Evaluating</span></td>
              <td>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button className="btn btn-outline" style={{padding: '6px'}} title="Add/Assign"><UserPlus size={16} /></button>
                  <button className="btn btn-outline" style={{padding: '6px'}} title="Edit Details"><Edit3 size={16} /></button>
                  <button className="btn btn-outline" style={{padding: '6px', color: 'var(--status-error)', borderColor: 'var(--status-error)'}} title="Delete"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
