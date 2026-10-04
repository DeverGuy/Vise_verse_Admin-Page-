"use client";

import React, { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Gavel,
  Award,
  RefreshCw,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Edit3,
  Plus,
  Trash2,
  Save,
  SlidersHorizontal
} from 'lucide-react';
import { DashboardStatsDB, ActivityLogDB } from '@/lib/supabase';
import { LoadingState, ErrorState } from '@/components/admin/States';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { TextInput, SelectInput } from '@/components/admin/FormControls';

const defaultDashboardStats: DashboardStatsDB = {
  participants: {
    total: 0,
    verified: 0,
    pending: 0,
    checkedIn: 0
  },
  teams: {
    total: 0,
    assigned: 0,
    pendingAssignment: 0,
    disqualified: 0
  },
  payments: {
    totalCollected: 0,
    paidTeamsCount: 0,
    pendingPaymentCount: 0,
    currency: 'INR'
  },
  judges: {
    totalJudges: 0,
    activeJudges: 0,
    assignedJudges: 0
  },
  evaluations: {
    totalEvaluations: 0,
    completed: 0,
    pending: 0,
    completionPercentage: 0
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStatsDB>(defaultDashboardStats);
  const [activities, setActivities] = useState<ActivityLogDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Metrics Modal State
  const [isEditMetricsModalOpen, setIsEditMetricsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<DashboardStatsDB>(defaultDashboardStats);

  // Add Custom Log Modal State
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({ category: 'System', title: '', status: 'Completed' });

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.stats) setStats(json.data.stats);
        if (json.data.recentActivities) setActivities(json.data.recentActivities);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Telemetry sync failed';
      setError(message);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openEditMetricsModal = () => {
    setEditForm(JSON.parse(JSON.stringify(stats)));
    setIsEditMetricsModalOpen(true);
  };

  const handleSaveMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalReq = Number(editForm.evaluations.totalEvaluations);
      const completed = Number(editForm.evaluations.completed);
      const compPct = totalReq > 0 ? Math.min(100, Math.round((completed / totalReq) * 100)) : 0;
      
      const updatedStats: DashboardStatsDB = {
        ...editForm,
        participants: {
          total: Number(editForm.participants.total),
          checkedIn: Number(editForm.participants.checkedIn),
          verified: Number(editForm.participants.verified),
          pending: Number(editForm.participants.pending)
        },
        teams: {
          total: Number(editForm.teams.total),
          assigned: Number(editForm.teams.assigned),
          pendingAssignment: Number(editForm.teams.pendingAssignment),
          disqualified: Number(editForm.teams.disqualified)
        },
        payments: {
          totalCollected: Number(editForm.payments.totalCollected),
          paidTeamsCount: Number(editForm.payments.paidTeamsCount),
          pendingPaymentCount: Number(editForm.payments.pendingPaymentCount),
          currency: editForm.payments.currency || 'INR'
        },
        judges: {
          totalJudges: Number(editForm.judges.totalJudges),
          activeJudges: Number(editForm.judges.activeJudges),
          assignedJudges: Number(editForm.judges.assignedJudges)
        },
        evaluations: {
          totalEvaluations: totalReq,
          completed: completed,
          pending: Math.max(0, totalReq - completed),
          completionPercentage: compPct
        }
      };

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATS', stats: updatedStats })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats);
        if (json.data.recentActivities) setActivities(json.data.recentActivities);
      }
      setIsEditMetricsModalOpen(false);
    } catch {
      setError('Failed to update metrics');
    }
  };

  const handleAddLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.title.trim()) return;
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_LOG', logEntry: logForm })
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.recentActivities) setActivities(json.data.recentActivities);
      }
      setLogForm({ category: 'System', title: '', status: 'Completed' });
      setIsAddLogModalOpen(false);
    } catch {
      setError('Failed to add audit log entry');
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_LOG', logId })
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.recentActivities) setActivities(json.data.recentActivities);
      }
    } catch {
      setError('Failed to delete audit log');
    }
  };

  const activityColumns: Column<ActivityLogDB>[] = [
    { key: 'time', header: 'Time', render: (row) => <span className="font-tech text-accent-primary font-bold">{row.time}</span> },
    { key: 'category', header: 'Category', render: (row) => <StatusBadge status={row.category} size="sm" /> },
    { key: 'title', header: 'Event Log', render: (row) => <span className="font-body text-text-primary text-sm">{row.title}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDeleteLog(row.id)}
          className="p-1.5 rounded text-text-secondary hover:text-status-error hover:bg-surface-color-light transition-colors"
          title="Delete Audit Log"
        >
          <Trash2 size={14} />
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-text-primary text-[2.4rem] md:text-[2.8rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-2">
              Vice Verse Dashboard
            </h1>
            <p className="text-text-secondary leading-[1.6] m-0 text-sm">
              Central Command Center — Real-time telemetry, participant stats, evaluation status, and financial metrics.
            </p>
          </div>
        </header>
        <LoadingState message="Connecting to Vice Verse live telemetry stream..." />
      </div>
    );
  }

  const paymentRatePct = stats.teams.total > 0 ? Math.round((stats.payments.paidTeamsCount / stats.teams.total) * 100) : 0;

  return (
    <div className="animate-fade-in flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-color/60 pb-5">
        <div>
          <h1 className="text-text-primary text-[2.4rem] md:text-[2.8rem] font-heading tracking-[2px] leading-[1.1] uppercase m-0 mb-1.5">
            Vice Verse Dashboard
          </h1>
          <p className="text-text-secondary leading-[1.6] m-0 text-sm">
            Central Command Center — Real-time telemetry, participant stats, evaluation status, and financial metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openEditMetricsModal}
            className="inline-flex items-center gap-2 px-4 py-2 font-bold font-tech text-xs uppercase tracking-[1px] cursor-pointer transition-all duration-200 border border-accent-secondary bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary hover:text-white hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] shrink-0 rounded"
          >
            <Edit3 size={15} /> Edit Metrics
          </button>
          <button
            onClick={() => setIsAddLogModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 font-bold font-tech text-xs uppercase tracking-[1px] cursor-pointer transition-all duration-200 border border-accent-tertiary/40 bg-surface-color text-accent-tertiary hover:bg-accent-tertiary hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] shrink-0 rounded"
          >
            <Plus size={15} /> Record Log
          </button>
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 font-bold font-tech text-xs uppercase tracking-[1px] cursor-pointer transition-all duration-200 border border-accent-primary/40 bg-surface-color text-accent-primary hover:bg-accent-primary hover:text-black hover:shadow-[0_0_15px_rgba(251,200,21,0.4)] shrink-0 rounded"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Syncing...' : 'Refresh Metrics'}
          </button>
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={fetchDashboardData} />}

      {/* Summary Statistic Cards - Perfectly Height & Baseline Aligned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Participant Stats */}
        <div className="bg-surface-color rounded-lg border border-border-color p-5 transition-all duration-300 hover:border-accent-primary hover:shadow-[0_0_20px_rgba(251,200,21,0.15)] hover:-translate-y-1 flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between gap-2">
            <span className="font-tech text-xs uppercase tracking-[1.5px] text-text-secondary font-bold">Total Participants</span>
            <button
              onClick={openEditMetricsModal}
              className="text-text-secondary hover:text-accent-primary transition-colors p-0.5"
              title="Edit Participant Telemetry"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 my-2">
            <h3 className="text-3xl font-heading tracking-[2px] text-text-primary m-0">
              {stats.participants.total}
            </h3>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(251,200,21,0.12)] text-accent-primary border border-accent-primary/30 shrink-0">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 font-tech text-xs text-status-success pt-1 border-t border-border-color/40">
            <CheckCircle2 size={13} /> {stats.participants.checkedIn} Checked In
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-surface-color rounded-lg border border-border-color p-5 transition-all duration-300 hover:border-accent-secondary hover:shadow-[0_0_20px_rgba(255,0,127,0.15)] hover:-translate-y-1 flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between gap-2">
            <span className="font-tech text-xs uppercase tracking-[1.5px] text-text-secondary font-bold">Teams Registered</span>
            <button
              onClick={openEditMetricsModal}
              className="text-text-secondary hover:text-accent-secondary transition-colors p-0.5"
              title="Edit Teams Telemetry"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 my-2">
            <h3 className="text-3xl font-heading tracking-[2px] text-text-primary m-0">
              {stats.teams.total}
            </h3>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(255,0,127,0.12)] text-accent-secondary border border-accent-secondary/30 shrink-0">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 font-tech text-xs text-accent-secondary pt-1 border-t border-border-color/40">
            <ShieldCheck size={13} /> {stats.teams.assigned} Assigned to Judges
          </div>
        </div>

        {/* Payment Stats */}
        <div className="bg-surface-color rounded-lg border border-border-color p-5 transition-all duration-300 hover:border-accent-tertiary hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:-translate-y-1 flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between gap-2">
            <span className="font-tech text-xs uppercase tracking-[1.5px] text-text-secondary font-bold">Payments Collected</span>
            <button
              onClick={openEditMetricsModal}
              className="text-text-secondary hover:text-accent-tertiary transition-colors p-0.5"
              title="Edit Payments Telemetry"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 my-2">
            <h3 className="text-3xl font-heading tracking-[2px] text-accent-tertiary m-0">
              ₹{stats.payments.totalCollected.toLocaleString()}
            </h3>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(0,240,255,0.12)] text-accent-tertiary border border-accent-tertiary/30 shrink-0">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 font-tech text-xs text-text-secondary pt-1 border-t border-border-color/40">
            <CreditCard size={13} /> {stats.payments.paidTeamsCount} Paid Teams
          </div>
        </div>

        {/* Judge & Evaluation Stats */}
        <div className="bg-surface-color rounded-lg border border-border-color p-5 transition-all duration-300 hover:border-status-success hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1 flex flex-col justify-between min-h-[135px] group">
          <div className="flex items-center justify-between gap-2">
            <span className="font-tech text-xs uppercase tracking-[1.5px] text-text-secondary font-bold">Judges & Panels</span>
            <button
              onClick={openEditMetricsModal}
              className="text-text-secondary hover:text-status-success transition-colors p-0.5"
              title="Edit Judge Telemetry"
            >
              <Edit3 size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 my-2">
            <h3 className="text-3xl font-heading tracking-[2px] text-text-primary m-0">
              {stats.judges.activeJudges} / {stats.judges.totalJudges}
            </h3>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(16,185,129,0.12)] text-status-success border border-status-success/30 shrink-0">
              <Gavel size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 font-tech text-xs text-status-success pt-1 border-t border-border-color/40">
            <Award size={13} /> {stats.evaluations.completed} Evaluations Done
          </div>
        </div>
      </div>

      {/* Progress Bars & Visual Telemetry - Perfectly Balanced Height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Evaluation Progress Meter */}
        <div className="glass-panel p-6 flex flex-col justify-between lg:col-span-2 rounded-lg border border-border-color h-full">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-heading tracking-[2px] text-text-primary uppercase m-0 flex items-center gap-2">
                  <Activity size={18} className="text-accent-secondary" /> Evaluation Telemetry
                </h2>
                <p className="text-xs text-text-secondary m-0 mt-1">Real-time status of hackathon judge evaluations</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-tech text-2xl font-bold text-accent-primary">
                  {stats.evaluations.completionPercentage}%
                </span>
                <button
                  onClick={openEditMetricsModal}
                  className="p-1 text-text-secondary hover:text-accent-primary transition-colors"
                  title="Edit Evaluation Telemetry"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-color-light border border-border-color h-3.5 rounded-full overflow-hidden p-0.5 mb-5">
              <div
                className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,0,127,0.5)]"
                style={{ width: `${stats.evaluations.completionPercentage}%` }}
              />
            </div>

            {/* SVG Visual Telemetry Chart */}
            <div className="w-full h-[155px] bg-bg-color/60 rounded border border-border-color p-4 relative flex items-end justify-between gap-2 overflow-hidden">
              <div className="absolute top-2 left-3 font-tech text-[10px] uppercase text-text-secondary">Submission Velocity (Hours)</div>
              {/* SVG Wave lines */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 150">
                <path d="M0,100 Q125,20 250,80 T500,40" fill="none" stroke="var(--accent-secondary)" strokeWidth="3" />
                <path d="M0,120 Q125,60 250,110 T500,70" fill="none" stroke="var(--accent-tertiary)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              {/* Visual Bars */}
              {[45, 60, 30, 85, 95, 70, 90, 100, 80, 65, 75, 90].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <div
                    className="w-full bg-gradient-to-t from-accent-secondary/30 to-accent-primary rounded-t transition-all hover:bg-accent-secondary cursor-pointer"
                    style={{ height: `${val * 1.05}px` }}
                    title={`Hour ${idx + 1}: ${val}% throughput`}
                  />
                  <span className="font-tech text-[9px] text-text-secondary">{idx + 1}h</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border-color text-center font-tech text-xs">
            <div>
              <div className="text-text-secondary uppercase">Completed</div>
              <div className="text-lg font-bold text-status-success">{stats.evaluations.completed}</div>
            </div>
            <div>
              <div className="text-text-secondary uppercase">Pending</div>
              <div className="text-lg font-bold text-accent-primary">{stats.evaluations.pending}</div>
            </div>
            <div>
              <div className="text-text-secondary uppercase">Total Required</div>
              <div className="text-lg font-bold text-text-primary">{stats.evaluations.totalEvaluations}</div>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="glass-panel p-6 flex flex-col justify-between rounded-lg border border-border-color h-full">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-heading tracking-[2px] text-text-primary uppercase m-0 flex items-center gap-2">
                <TrendingUp size={18} className="text-accent-tertiary" /> Team Metrics
              </h2>
              <button
                onClick={openEditMetricsModal}
                className="p-1 text-text-secondary hover:text-accent-tertiary transition-colors"
                title="Edit Team Metrics"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 rounded bg-surface-color-light border border-border-color">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-status-success" />
                  <div>
                    <div className="font-tech text-xs uppercase font-bold text-text-primary">Assigned Teams</div>
                    <div className="text-[11px] text-text-secondary">Linked with active judges</div>
                  </div>
                </div>
                <span className="font-tech text-base font-bold text-status-success">{stats.teams.assigned}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-surface-color-light border border-border-color">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-accent-primary" />
                  <div>
                    <div className="font-tech text-xs uppercase font-bold text-text-primary">Pending Assignment</div>
                    <div className="text-[11px] text-text-secondary">Awaiting judge allocation</div>
                  </div>
                </div>
                <span className="font-tech text-base font-bold text-accent-primary">{stats.teams.pendingAssignment}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-surface-color-light border border-border-color">
                <div className="flex items-center gap-3">
                  <AlertOctagon size={16} className="text-status-error" />
                  <div>
                    <div className="font-tech text-xs uppercase font-bold text-text-primary">Disqualified Teams</div>
                    <div className="text-[11px] text-text-secondary">Flagged for rule violations</div>
                  </div>
                </div>
                <span className="font-tech text-base font-bold text-status-error">{stats.teams.disqualified}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border-color flex flex-col gap-2 font-tech text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary uppercase font-bold">Payment Verification Rate</span>
              <span className="text-accent-tertiary font-bold text-sm">
                {paymentRatePct}% Verified
              </span>
            </div>
            <div className="w-full bg-surface-color-light border border-border-color h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-accent-tertiary rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                style={{ width: `${paymentRatePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Data Table */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="text-lg font-heading tracking-[2px] text-text-primary uppercase m-0">
            Live Audit Logs & Operations
          </h2>
          <button
            onClick={() => setIsAddLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-tech text-xs uppercase tracking-[1px] border border-accent-primary/40 bg-surface-color text-accent-primary hover:bg-accent-primary hover:text-black transition-all rounded"
          >
            <Plus size={14} /> Add Log Entry
          </button>
        </div>
        <DataTable
          columns={activityColumns}
          data={activities}
          keyExtractor={(row) => row.id}
          isEmpty={activities.length === 0}
          emptyTitle="No Audit Logs Recorded"
          emptyDescription="Audit logs will appear here live when actions take place."
        />
      </div>

      {/* EDIT DASHBOARD METRICS MODAL */}
      <Modal
        isOpen={isEditMetricsModalOpen}
        onClose={() => setIsEditMetricsModalOpen(false)}
        title="Admin Control — Edit Dashboard Telemetry & Overrides"
      >
        <form onSubmit={handleSaveMetrics} className="flex flex-col gap-5">
          <div className="bg-surface-color-light p-3 rounded border border-border-color text-xs text-text-secondary font-tech flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-accent-primary shrink-0" />
            Modify any metrics below. Saving will immediately update the live dashboard telemetry and write an audit log entry.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participants Section */}
            <div className="p-4 rounded border border-border-color bg-surface-color/60 flex flex-col gap-3">
              <h4 className="text-sm font-heading tracking-[1px] text-accent-primary m-0 uppercase flex items-center gap-2">
                <Users size={16} /> Participants Stats
              </h4>
              <TextInput
                label="Total Participants"
                type="number"
                value={editForm.participants.total}
                onChange={(e) => setEditForm({
                  ...editForm,
                  participants: { ...editForm.participants, total: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Checked In"
                type="number"
                value={editForm.participants.checkedIn}
                onChange={(e) => setEditForm({
                  ...editForm,
                  participants: { ...editForm.participants, checkedIn: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Verified"
                type="number"
                value={editForm.participants.verified}
                onChange={(e) => setEditForm({
                  ...editForm,
                  participants: { ...editForm.participants, verified: Number(e.target.value) }
                })}
              />
            </div>

            {/* Teams Section */}
            <div className="p-4 rounded border border-border-color bg-surface-color/60 flex flex-col gap-3">
              <h4 className="text-sm font-heading tracking-[1px] text-accent-secondary m-0 uppercase flex items-center gap-2">
                <ShieldCheck size={16} /> Teams Registered
              </h4>
              <TextInput
                label="Total Teams"
                type="number"
                value={editForm.teams.total}
                onChange={(e) => setEditForm({
                  ...editForm,
                  teams: { ...editForm.teams, total: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Assigned Teams"
                type="number"
                value={editForm.teams.assigned}
                onChange={(e) => setEditForm({
                  ...editForm,
                  teams: { ...editForm.teams, assigned: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Disqualified Teams"
                type="number"
                value={editForm.teams.disqualified}
                onChange={(e) => setEditForm({
                  ...editForm,
                  teams: { ...editForm.teams, disqualified: Number(e.target.value) }
                })}
              />
            </div>

            {/* Payments Section */}
            <div className="p-4 rounded border border-border-color bg-surface-color/60 flex flex-col gap-3">
              <h4 className="text-sm font-heading tracking-[1px] text-accent-tertiary m-0 uppercase flex items-center gap-2">
                <CreditCard size={16} /> Payments Telemetry
              </h4>
              <TextInput
                label="Total Collected (₹)"
                type="number"
                value={editForm.payments.totalCollected}
                onChange={(e) => setEditForm({
                  ...editForm,
                  payments: { ...editForm.payments, totalCollected: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Paid Teams Count"
                type="number"
                value={editForm.payments.paidTeamsCount}
                onChange={(e) => setEditForm({
                  ...editForm,
                  payments: { ...editForm.payments, paidTeamsCount: Number(e.target.value) }
                })}
              />
            </div>

            {/* Judges & Evaluations Section */}
            <div className="p-4 rounded border border-border-color bg-surface-color/60 flex flex-col gap-3">
              <h4 className="text-sm font-heading tracking-[1px] text-status-success m-0 uppercase flex items-center gap-2">
                <Gavel size={16} /> Judges & Evaluations
              </h4>
              <TextInput
                label="Active Judges"
                type="number"
                value={editForm.judges.activeJudges}
                onChange={(e) => setEditForm({
                  ...editForm,
                  judges: { ...editForm.judges, activeJudges: Number(e.target.value), totalJudges: Math.max(Number(e.target.value), editForm.judges.totalJudges) }
                })}
              />
              <TextInput
                label="Completed Evaluations"
                type="number"
                value={editForm.evaluations.completed}
                onChange={(e) => setEditForm({
                  ...editForm,
                  evaluations: { ...editForm.evaluations, completed: Number(e.target.value) }
                })}
              />
              <TextInput
                label="Total Required Evaluations"
                type="number"
                value={editForm.evaluations.totalEvaluations}
                onChange={(e) => setEditForm({
                  ...editForm,
                  evaluations: { ...editForm.evaluations, totalEvaluations: Number(e.target.value) }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => setIsEditMetricsModalOpen(false)}
              className="px-4 py-2 font-tech text-xs uppercase tracking-[1px] border border-border-color bg-surface-color text-text-secondary hover:text-text-primary rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 font-bold font-tech uppercase tracking-[1px] bg-accent-primary text-black hover:bg-accent-primary-hover shadow-[0_0_15px_rgba(251,200,21,0.3)] rounded"
            >
              <Save size={16} /> Save Telemetry Overrides
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD LOG MODAL */}
      <Modal
        isOpen={isAddLogModalOpen}
        onClose={() => setIsAddLogModalOpen(false)}
        title="Record Custom Live Audit Log Entry"
      >
        <form onSubmit={handleAddLogSubmit} className="flex flex-col gap-4">
          <SelectInput
            label="Log Category"
            value={logForm.category}
            onChange={(e) => setLogForm({ ...logForm, category: e.target.value })}
            options={[
              { value: 'System', label: 'System' },
              { value: 'Participants', label: 'Participants' },
              { value: 'Judges', label: 'Judges' },
              { value: 'Announcements', label: 'Announcements' },
              { value: 'Settings', label: 'Settings' },
              { value: 'Security', label: 'Security' }
            ]}
          />
          <TextInput
            label="Log Event Title / Description"
            placeholder="e.g. Judge Evaluation Panel #2 started Round 1 evaluations"
            value={logForm.title}
            onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
            required
          />
          <SelectInput
            label="Event Status"
            value={logForm.status}
            onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
            options={[
              { value: 'Completed', label: 'Completed' },
              { value: 'Active', label: 'Active' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Urgent', label: 'Urgent' }
            ]}
          />

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={() => setIsAddLogModalOpen(false)}
              className="px-4 py-2 font-tech text-xs uppercase tracking-[1px] border border-border-color bg-surface-color text-text-secondary rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 font-bold font-tech uppercase tracking-[1px] bg-accent-tertiary text-black hover:bg-cyan-400 rounded"
            >
              <Plus size={16} /> Record Operation Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
